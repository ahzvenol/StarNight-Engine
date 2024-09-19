import { ActScopedCommand, CommandRunFunction, State } from "@/core/Command"
import { Continue } from "./!continue"

export let flag = false

export let num = 0

const onActStart = () => flag = false

const jump: CommandRunFunction = ({ state }) => ({ number }) => {
    flag = true
    num = number
    // @ts-expect-error
    Continue.run({ state })()
}

export const Jump: ActScopedCommand = { onActStart, run: jump }

// const jumpMap = {}

// // 预先计算出target字符串对应的幕来跳转,或者,这个参数也可能是number?
// const jump = (context) => ({ target }) => {
//     context.actIndex(jumpMap[target] - 1)
// }

// // 可能不算一个命令,预处理
// const sign = (context) => ({ name }) => jumpMap[name] = index

// export { jump, sign }