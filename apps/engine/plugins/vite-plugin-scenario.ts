import type { NodePath } from '@babel/traverse'
import type { Plugin } from 'vite'
import pathUtil from 'path'
import { mergeConfig } from 'vite'
import _generate from '@babel/generator'
import { parse } from '@babel/parser'
import _traverse from '@babel/traverse'
import * as t from '@babel/types'

// @ts-expect-error 不存在属性“default
const traverse = _traverse.default as typeof _traverse
// @ts-expect-error 不存在属性“default
const generate = _generate.default as typeof _generate

type Options = { src: string | string[], async: string | string[], await: string | string[] }
type InternalOptions = { src: string[], async: string[], await: string[] }

function isStringOrTemplateLiteral(node: t.Node | null | undefined) {
    return t.isStringLiteral(node) || t.isTemplateLiteral(node)
}

function isJSXElementOrJSXFragment(node: t.Node | null | undefined) {
    return t.isJSXElement(node) || t.isJSXFragment(node)
}

// 关键字: $action,$context,$await,$await,$say

export default function scenarioPlugin(options: Partial<Options> = {}): Plugin {
    let currentMode = 'development'

    if (options.src && !Array.isArray(options.src)) options.src = [options.src]
    if (options.async && !Array.isArray(options.async)) options.async = [options.async]
    if (options.await && !Array.isArray(options.await)) options.await = [options.await]

    const opt = mergeConfig({ src: ['src'], async: ['$async'], await: ['$await'] }, options) as InternalOptions

    return {
        name: 'vite-plugin-scenario-transform',
        enforce: 'pre',
        config(_, { mode }) {
            currentMode = mode // 存储当前 mode
        },
        async transform(code: string, id: string) {
            if (!/\.scenario\.(mjs|js|mts|ts|jsx|tsx)$/.test(id)) return null

            // 转换注释形式的幕分隔符到$action
            code = code
                .split(/(?:\r\n|[\n-\r\u0085\u2028\u2029])/)
                .map((line) => (/^\s*\/\/\s*-{4,}\s*$/.test(line) ? 'yield $action;' : line))
                .join('\n')

            const projectRoot = process.cwd()
            const relativePath = pathUtil.relative(projectRoot, id)
            // 将反斜杠(Windows 路径)统一替换为正斜杠,以保持跨平台一致性
            const normalizedRelativePath = relativePath.replace(/\\/g, '/')
            // 更新已读记录到当前场景ID
            code = `$context.instance.current.sence("${normalizedRelativePath}");` + code

            const ast = parse(code, { sourceType: 'module', plugins: ['typescript', 'jsx'], errorRecovery: true })

            const importDeclarations: t.ImportDeclaration[] = []
            const otherNodes: t.Statement[] = []

            ast.program.body.forEach((node) => {
                if (t.isImportDeclaration(node)) {
                    importDeclarations.push(node)
                } else {
                    otherNodes.push(node)
                }
            })

            const rootAsyncGeneratorFunction = t.functionExpression(null, [], t.blockStatement(otherNodes), true, true)

            const exportDefaultNode = t.exportDefaultDeclaration(rootAsyncGeneratorFunction)

            ast.program.body = [...importDeclarations, exportDefaultNode]

            // 只特殊处理异步生成器函数中的代码
            const inRootAsyncGenerator = (path: NodePath<t.Node>) =>
                path.scope.getFunctionParent()?.block === rootAsyncGeneratorFunction

            let debug = false

            traverse(ast, {
                ExpressionStatement(path) {
                    if (!inRootAsyncGenerator(path) || currentMode === 'production') return
                    const expression = path.node.expression
                    if (t.isIdentifier(expression, { name: '$debugger' })) {
                        path.replaceWith(t.yieldExpression(expression))
                        debug = true
                    }
                },
                // 编译$context到(await (yield async (ctx) => ctx))
                Identifier(path) {
                    if (path.node.name === '$context') {
                        if (!inRootAsyncGenerator(path)) return
                        // 检查父节点，确保不是在声明中，也不是属性名（非计算）等特殊情况
                        const parent = path.parentPath
                        if (
                            (parent.isVariableDeclarator() && parent.get('id') === path) // const $context = ...
                            || (parent.isFunctionDeclaration() && parent.get('id') === path)// function $context() {}
                            || (parent.isClassDeclaration() && parent.get('id') === path) // class $context {}
                            || (parent.isMemberExpression() && parent.get('property') === path && !parent.node.computed) // obj.$context
                            || (parent.isObjectProperty() && parent.get('key') === path && !parent.node.computed) // { $context: ... }
                        ) return
                        path.replaceWith(
                            t.parenthesizedExpression(
                                t.awaitExpression(
                                    t.yieldExpression(
                                        t.arrowFunctionExpression([t.identifier('ctx')], t.identifier('ctx'), true)
                                    )
                                )
                            )
                        )
                    }
                }
            })

            traverse(ast, {
                // 编译$async.method()到yield $async.method()
                // 编译$await.method()到await (yield $await.method())
                // 编译$call(url)到yield* $scenario.default()
                CallExpression(path) {
                    if (!inRootAsyncGenerator(path)) return
                    const callee = path.node.callee
                    if (t.isMemberExpression(callee)) {
                        if (
                            opt.async.some((name) => t.isIdentifier(callee.object, { name }))
                        ) {
                            path.replaceWith(t.yieldExpression(path.node))
                            path.skip()
                        } else if (
                            opt.await.some((name) => t.isIdentifier(callee.object, { name }))
                        ) {
                            path.replaceWith(t.awaitExpression(t.parenthesizedExpression(t.yieldExpression(path.node))))
                            path.skip()
                        }
                    } else if (t.isIdentifier(path.node.callee, { name: '$call' })) {
                        path.replaceWith(
                            t.yieldExpression(
                                t.callExpression(
                                    t.memberExpression(
                                        t.parenthesizedExpression(
                                            t.awaitExpression(
                                                t.callExpression(t.import(), [path.node.arguments[0]])
                                            )
                                        ),
                                        t.identifier('default')
                                    ),
                                    []
                                ),
                                true
                            ))
                        path.skip()
                    }
                },
                // 编译野生字符串到yield $say({text,clip?})
                ExpressionStatement(path) {
                    if (!inRootAsyncGenerator(path)) return
                    const expression = path.node.expression
                    let properties = null
                    if (isStringOrTemplateLiteral(expression) || isJSXElementOrJSXFragment(expression)) {
                        properties = [t.objectProperty(t.identifier('text'), expression)]
                    } else if (
                        t.isBinaryExpression(expression)
                        && expression.operator === '+'
                        && (isStringOrTemplateLiteral(expression.left) || isJSXElementOrJSXFragment(expression.left))
                        && isStringOrTemplateLiteral(expression.right)
                    ) {
                        properties = [
                            t.objectProperty(t.identifier('text'), expression.left),
                            t.objectProperty(t.identifier('clip'), expression.right)
                        ]
                    }
                    if (properties) {
                        const sayCall = t.callExpression(t.identifier('$say'), [t.objectExpression(properties)])
                        path.insertBefore(t.yieldExpression(t.identifier('$action')))
                        path.replaceWith(t.expressionStatement(t.yieldExpression(sayCall)))
                        path.skip()
                    }
                },
                // 编译野生标签字符串到yield $say({name,text,clip?})
                LabeledStatement(path) {
                    if (!inRootAsyncGenerator(path)) return
                    if (t.isExpressionStatement(path.node.body)) {
                        const expression = path.node.body.expression
                        let properties = null
                        if (isStringOrTemplateLiteral(expression) || isJSXElementOrJSXFragment(expression)) {
                            properties = [t.objectProperty(t.identifier('text'), expression)]
                        } else if (
                            t.isBinaryExpression(expression)
                            && expression.operator === '+'
                            && (isStringOrTemplateLiteral(expression.left) || isJSXElementOrJSXFragment(expression.left))
                            && isStringOrTemplateLiteral(expression.right)
                        ) {
                            properties = [
                                t.objectProperty(t.identifier('text'), expression.left),
                                t.objectProperty(t.identifier('clip'), expression.right)
                            ]
                        }
                        if (properties) {
                            const labelName = path.node.label.name
                            properties.unshift(t.objectProperty(t.identifier('name'), t.stringLiteral(labelName)))
                            const sayCall = t.callExpression(t.identifier('$say'), [t.objectExpression(properties)])
                            path.insertBefore(t.yieldExpression(t.identifier('$action')))
                            path.replaceWith(t.expressionStatement(t.yieldExpression(sayCall)))
                            path.skip()
                        }
                    }
                }
            })

            let action = 0
            const assets: string[][] = [[]]

            traverse(ast, {
                // 从上到下为yield编号
                YieldExpression(path) {
                    if (!inRootAsyncGenerator(path)) return
                    // yield 的参数是名为 '$action' 的 Identifier)
                    if (!path.node.delegate && t.isIdentifier(path.node.argument, { name: '$action' })) {
                        path.replaceWith(t.yieldExpression(t.numericLiteral(++action)))
                        assets[action] = []
                    }
                },
                // 筛选出静态src,推入对应幕的资源列表
                ObjectExpression(objectPath) {
                    objectPath.node.properties.forEach((prop) => {
                        if (
                            t.isObjectProperty(prop) && t.isStringLiteral(prop.value)
                            && opt.src.some((name) =>
                                (t.isIdentifier(prop.key) && prop.key.name === name)
                                || (t.isStringLiteral(prop.key) && prop.key.value === name)
                            )
                        ) {
                            assets[action].push(prop.value.value)
                        }
                    })
                }
            })

            const assetsListElements: t.ArrayExpression[] = assets.map((array) =>
                t.arrayExpression(array.map((s) => t.stringLiteral(s)))
            )

            exportDefaultNode.declaration = t.callExpression(
                t.memberExpression(t.identifier('Object'), t.identifier('assign')),
                [
                    rootAsyncGeneratorFunction, // target: 原始的函数表达式节点
                    t.objectExpression([
                        t.objectProperty(t.identifier('assetmap'), t.arrayExpression(assetsListElements)),
                        ...(debug ? [t.objectProperty(t.identifier('debug'), t.booleanLiteral(true))] : [])
                    ]) // sources: { assetmap: ... }
                ]
            )

            return generate(ast, { sourceMaps: true, retainLines: false })
        }
    }
}
