import { ArrayUtils, ObjectUtils } from "../../util"

// interface Base { "name": string }
interface Generator { type: "generator", kind: string }
interface Clone extends Generator { kind: "clone", count: number, args?: ObjectMap<[string, number?]> }
// issue:varName如果不需要,默认值可以弄uuid // 不过，可能出现这种情况吗
interface Mutex extends Generator { kind: "mutex", varName: string }
// tag:如果不限制生成器的顺序而只限制数量，感觉可以弄出很多魔法
interface Container { type: "container", value: [Clone?, Mutex?], children: Array<TElement | Container> }

// todo:标签该加糖了,这样这部分内容才能独立出去
// 考虑先展开标签,再展开生成器,提高已完成部分的稳定性

// tag:生成器上要不要允许挂标签?或许有必要

interface TElement {
    type: "element"
    id?: IdTag
    class?: ClassTag
    style?: CssTag
    javaScript?: Array<JsTag>
    // 可能也需要JsTag
    when?: ShowTag
    createVar?: VarTag
    children?: Array<TElement | Container>
}

function unZipGenerator(container: Container | TElement): TElement {
    if (container.type === "element") {
        container.children?.forEach(e => unZipGenerator(e))
        return container
    }
    for (const key in container.children) {
        if (container.children[key].type === "element") { }
        else if (container.children[key].type === "container") {
            container.children[key] = unZipGenerator(container.children[key] as Container)
        }
    }
    const element: TElement = {
        type: "element",
        style: { kind: "css", value: "width: 100%;height: 100%;" },
        createVar: { kind: "var", value: {} },
        children: container.children as Array<TElement>
    }
    if (container.value[0]) {
        const clone = container.value[0]
        const varMap = {}
        // 根据用户选择进行变量的原地扩展[1,2,3] => [1,1,1,2,2,2,3,3,3]
        // 仍小于count的情况下rep补足
        const extend = (arr: Array<any>, count: number): Array<any> => arr.flatMap(e => Array(count).fill(e))
        let evalVarStr = ""
        for (const key in clone.args || {}) {
            varMap[key] = extend(eval(`[${clone.args![key][0]}]`), clone.args![key][1] || 1)
            if (clone.count % varMap[key].length > 0) {
                varMap[key] = ArrayUtils.deepClone(varMap[key], clone.count % varMap[key].length)
            }
            evalVarStr += `let ${key} = ${JSON.stringify(varMap[key])};`
        }
        // 进行元素的克隆,如果没有变量需要赋值,到这就可以break掉了
        element.children = ArrayUtils.deepClone(container.children, clone.count)
        if (ObjectUtils.isNotEmpty(varMap)) {
            for (let i = 0; i < element.children!.length; i++) {
                // 把元素转为字符串处理,这样更方便
                let str = JSON.stringify(element.children[i])
                let k = 0
                // 把{{}}中的内容提取出来 {{aaa}}xxx{{bbb}} => ["aaa","bbb"]
                const matchArrayStr = JSON.stringify(str.match(/(?<={{)[^{}]+(?=}})/g) || [''])
                    .replaceAll(/(?<!\\)"/g, '')
                    .replaceAll(/\\"/g, '"')
                // 通过evalVarStr生成变量环境,并把matchArrayStr还原回代码形式重新运行 ["a + \"1\""] => [a + "1"]
                const evalResultArray = (0, eval)(`let i = ${i};${evalVarStr}${matchArrayStr}`)
                // 根据{{any}}}拆分字符串 aa{{xxx}}bb => ["aa","bb"] 并引用上面计算好的表达式运行结果拼接回去
                str = str.split(/{{[^{}]+}}/).reduce((a, b) => a + evalResultArray[k++].toString() + b)
                element.children[i] = JSON.parse(str)
            }
        }
    }
    if (container.value[1]) {
        const mutex = container.value[1]
        element.createVar!.value[mutex.varName] = 0
        const children = element.children as Array<TElement>
        for (let i = 0; i < children.length; i++) {
            children[i].when = children[i].when ? children[i].when : { kind: "show", value: [] }
            children[i].when!.value.push({ var: mutex.varName, operator: "===", condition: i })
        }
    }
    return element
}


type TagKind = "js" | "css" | "class" | "id" | "show" | "var"

type Lifecycle = "onclick" | "onMount" | "onCleanup"

type Operator = ">" | ">=" | "<=" | "<" | "==="

// tag 因为全是tag,所以考虑移除type属性并将kind转为type

// interface Tag { "type": "tag", "kind": TagKind, value: any }
interface Tag { "kind": TagKind, value: any }

interface IdTag extends Tag { kind: "id", value: string }
interface ClassTag extends Tag { kind: "class", value: string }
interface CssTag extends Tag { kind: "css", value: string }
interface JsTag extends Tag { kind: "js", lifecycle: Lifecycle, value: string }
interface ShowTag extends Tag { kind: "show", value: Array<{ var: string, operator: Operator, condition: string | number | boolean }> }
interface VarTag extends Tag { kind: "var", value: ObjectMap<string | number | boolean> }
// tag:好像kind也没太大必要?
interface JsonElement {
    id?: IdTag
    class?: ClassTag
    style?: CssTag
    javaScript?: Array<JsTag>
    // 可能也需要JsTag
    when?: ShowTag
    createVar?: VarTag
    children?: Array<JsonElement>
}

export { unZipGenerator }
export type { JsonElement, TElement, Container }
