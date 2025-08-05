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

type Options = { src: string | string[] }
type InternalOptions = { src: string[] }

// 关键字: $action,$debugger,$context,$include,$async,$await,$character

export default function scenarioPlugin(options: Partial<Options> = {}): Plugin {
    if (options.src && !Array.isArray(options.src)) options.src = [options.src]

    const opt = mergeConfig({ src: ['src'] }, options) as InternalOptions

    return {
        name: 'vite-plugin-scenario-transform',
        enforce: 'pre',
        async transform(code: string, id: string) {
            if (!/\.scenario\.(mjs|js|mts|ts|jsx|tsx)$/.test(id)) return null

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

            const rootAsyncGeneratorFunction = t.functionExpression(null, [], t.blockStatement(otherNodes), true)

            const exportDefaultNode = t.exportDefaultDeclaration(rootAsyncGeneratorFunction)

            ast.program.body = [...importDeclarations, exportDefaultNode]

            // 只特殊处理异步生成器函数中的代码
            const inRootAsyncGenerator = (path: NodePath<t.Node>) =>
                path.scope.getFunctionParent()?.block === rootAsyncGeneratorFunction

            let debug = false

            traverse(ast, {
                // 编译$debugger到yield $debugger
                // 编译$action到yield $action
                ExpressionStatement(path) {
                    if (!inRootAsyncGenerator(path)) return
                    const expression = path.node.expression

                    if (t.isIdentifier(expression, { name: '$action' })) {
                        path.replaceWith(t.yieldExpression(expression))
                    } else if (t.isIdentifier(expression, { name: '$debugger' })) {
                        path.replaceWith(t.yieldExpression(expression))
                        debug = true
                    }
                },
                // 编译$context到yield (ctx) => ctx)
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
                                t.yieldExpression(
                                    t.arrowFunctionExpression([t.identifier('ctx')], t.identifier('ctx'))
                                )
                            )
                        )
                    }
                }
            })

            traverse(ast, {
                // 编译$.method()到yield $.method()
                // 编译$$.method()到yield (yield $$.method())
                // 编译$include(url)到yield* yield(import(url)).default()
                CallExpression(path) {
                    if (!inRootAsyncGenerator(path)) return
                    const callee = path.node.callee
                    if (t.isMemberExpression(callee)) {
                        if (t.isIdentifier(callee.object, { name: '$' })) {
                            path.replaceWith(t.yieldExpression(path.node))
                            path.skip()
                        } else if (t.isIdentifier(callee.object, { name: '$$' })) {
                            path.replaceWith(t.yieldExpression(t.parenthesizedExpression(t.yieldExpression(path.node))))
                            path.skip()
                        }
                    } else if (t.isIdentifier(path.node.callee, { name: '$include' })) {
                        path.replaceWith(
                            t.yieldExpression(
                                t.callExpression(
                                    t.memberExpression(
                                        t.parenthesizedExpression(
                                            t.yieldExpression(
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
                ExpressionStatement(path) {
                    if (!inRootAsyncGenerator(path)) return
                    const expression = path.node.expression
                    let callExpr: t.CallExpression | null = null
                    let isTaggedTemplatePattern = false

                    // --- 内部逻辑判断：检查 expression 是否是 TaggedTemplateExpression 模式 ---
                    let tag: t.Expression | null = null
                    const callArgs: t.Expression[] = []

                    if (t.isTaggedTemplateExpression(expression)) {
                        // Case: noi`...`
                        tag = expression.tag
                        callArgs.push(expression.quasi) // 将 TemplateLiteral 节点作为参数
                        isTaggedTemplatePattern = true
                    } else if (
                        t.isBinaryExpression(expression)
                        && expression.operator === '+'
                        && t.isTaggedTemplateExpression(expression.left)
                        && t.isStringLiteral(expression.right)
                    ) {
                        // Case: noi`...` + '/audio.mp3'
                        tag = expression.left.tag
                        callArgs.push(expression.left.quasi)
                        callArgs.push(expression.right)
                        isTaggedTemplatePattern = true
                    }

                    // 如果匹配了 TaggedTemplate 模式，构建 CallExpression
                    if (isTaggedTemplatePattern && tag) {
                        callExpr = t.callExpression(tag, callArgs)
                    }

                    // --- 根据是否匹配以及父级类型进行转换 ---
                    if (callExpr) {
                        // 成功匹配到 TaggedTemplateExpression 模式
                        const parentPath = path.parentPath

                        const statementToModify = parentPath.isLabeledStatement() ? parentPath : path

                        // 判断父级是否是带 '$' 标签的 LabeledStatement
                        // 规则: $: noi`...` -> yield noi(...)
                        if (parentPath.isLabeledStatement() && parentPath.node.label.name === '$') {
                            parentPath.replaceWith(t.expressionStatement(t.yieldExpression(callExpr)))
                        // 判断父级是否是带 '$$' 标签的 LabeledStatement
                        // 规则: $$: noi`...` -> yield (yield noi(...))
                        } else if (parentPath.isLabeledStatement() && parentPath.node.label.name === '$$') {
                            parentPath.replaceWith(t.expressionStatement(t.yieldExpression(t.yieldExpression(callExpr))))
                        // 规则: noi`...` 或 otherLabel: noi`...` -> yield $action; yield noi(...)
                        } else {
                            statementToModify.insertBefore(t.expressionStatement(t.yieldExpression(t.identifier('$action'))))
                            statementToModify.replaceWith(t.expressionStatement(t.yieldExpression(callExpr)))
                        }

                        // 添加没有实际影响的表达式，在后续筛选src时记录资源
                        if (callArgs.length > 1) {
                            statementToModify.insertAfter(
                                t.expressionStatement(
                                    t.objectExpression([
                                        t.objectProperty(t.identifier('src'), callArgs[1])
                                    ])
                                )
                            )
                        }

                        path.skip()
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
