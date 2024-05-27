import JsonElement from './JsonElement'


type TagKind = "js" | "css" | "class" | "id" | "show" | "var"
type Lifecycle = "onclick" | "onMount" | "onCleanup"
type Operator = ">" | ">=" | "<=" | "<" | "==="
interface Tag { "kind": TagKind, value: any }
interface IdTag extends Tag { kind: "id", value: string }
interface ClassTag extends Tag { kind: "class", value: string }
interface CssTag extends Tag { kind: "css", value: string }
interface JsTag extends Tag { kind: "js", lifecycle: Lifecycle, value: string }
interface ShowTag extends Tag { kind: "show", value: Array<{ var: string, operator: Operator, condition: string | number | boolean }> }
interface VarTag extends Tag { kind: "var", value: { [key: string]: string | number | boolean } }


import { ObjectUtils, ArrayUtils } from "../../util"

// tag:这个层级应该可以只剩生成器了,目前考虑有克隆和互斥
// todo:是时候写这个了,按V1的想法来写
// name属性到UIMaker才会用到
// interface Base { "name": string }
interface Base { children: Array<Element | Generator> }

interface Element extends Base { }

interface Generator { type: "generator", kind: string }

interface Clone extends Generator { kind: "clone", count: number, args?: { [key: string]: string } }

interface Mutex extends Generator { kind: "mutex" }

interface Container extends Base { type: " container", value: [Clone?, Mutex?], target: Array<Element> }

// 两种方案,生成器集合和生成器嵌套,先选择前者 // 生成器执行有优先级顺序，感觉需要重调
// 看起来要插值,考虑字符串插值语法{{}}

// Array<Generator>改为生成器枚举？使用过程式语法处理生成器
// 生成器要不改成class,接受对象输出对象

// 要确定下element的内容了。。有点麻烦,总之该是个对象吧
// 按照上一层的情况，正好排除了js标签（是数组），其他的都可以运算，元素定义可以拖延一下了
// 先照抄上一层的element

// tag:考虑和上一层合并吧

// fix 不对不对,乱套了,最关键的复制元素呢
// 遍历深度是不是也只有一层。。。
// 可能只需要一层的遍历深度？
// 看起来也没有达到填充对应下标变量的目的
// 规定下标为i,继续进行编写

interface Tag { }

const testDic: any = {

}

const extend = (arr: Array<any>, count: number): Array<any> => arr.flatMap(e => Array(count).fill(e))

function unZipGenerator(container: Container): Array<Element> {
    if (container.value[0]) {
        const clone = container.value[0]
        const varMap = {}
        // todo:根据用户选择
        // 进行原地扩展[1,2,3] => [1,1,1,2,2,2,3,3,3]
        // 仍小于count的情况下rep补足
        for (const key in clone.args || {}) varMap[key] = eval(`[${clone[key]}]`)
        for (const key in varMap) varMap[key] = ArrayUtils.shallowClone(varMap[key], clone.count % varMap[key].length)
        // 进行元素的克隆,如果没有变量需要赋值,到这就可以break掉了
        container.target = ArrayUtils.deepClone(container.target, clone.count)
        if (ObjectUtils.isNotEmpty(varMap)) {
            let str = JSON.stringify(container.target)
            let k = 0
            const matchArray = str.match(/(?<={{)[^{}]+(?=}})/g) || ['']
            container.target = JSON.parse(str.split(/{{[^{}]+}}/).reduce((a, b) => a + b + eval(`object.${matchArray[k++]}`)))
        }
    }
    return container.target
}

export default {}