import type { Commands, RuntimeCommandEntities, RuntimeCommandLike } from './types/Command'
import type { Macro, Macros } from './types/Marco'

export class Converter {
    constructor(
        private readonly commands: Commands,
        private readonly macros: Macros
    ) {}

    isRealCommand = (row: RuntimeCommandLike): row is RuntimeCommandEntities => row.key in this.commands

    // 递归过滤不存在的命令
    filterRealCommandsRecursively = (rows: Array<RuntimeCommandLike>): Array<RuntimeCommandEntities> =>
        rows.flatMap((row) => {
            if (this.isRealCommand(row)) {
                if (Array.isArray(row.args)) {
                    return [{ ...row, args: this.filterRealCommandsRecursively(row.args) }]
                } else {
                    return [row]
                }
            } else {
                // @ts-expect-error 类型“never”上不存在属性“key”。
                console.error(`找不到命令:${row.key}`, row.args)
                return []
            }
        })

    // 递归应用宏到命令的每个子节点
    applyMacroToCommandNodes = (rows: Array<RuntimeCommandLike>, macro: Macro): Array<RuntimeCommandLike> =>
        rows.flatMap((row) => {
            if (Array.isArray(row.args)) {
                return [{ ...row, args: this.applyMacroToCommandNodes(row.args, macro) }]
            } else if (row.key !== macro.key) {
                return [row]
            } else {
                try {
                    return macro.apply(row.args)
                } catch (error) {
                    console.error(`macro转换出错:${row.key}`, row.args, error)
                    return []
                }
            }
        })

    // 对节点依次应用宏,这期间可能产生节点树
    applyMacrosToCommand = (row: RuntimeCommandLike): Array<RuntimeCommandLike> =>
        this.macros.reduce<Array<RuntimeCommandLike>>(this.applyMacroToCommandNodes, [row])

    // 对每个命令节点应用转换
    applyMacrosToCommandsNodes = (rows: Array<RuntimeCommandLike>): Array<RuntimeCommandLike> =>
        rows.flatMap((row) => {
            if (Array.isArray(row.args)) return [{ ...row, args: this.applyMacrosToCommandsNodes(row.args) }]
            else return this.applyMacrosToCommand(row)
        })
}

// // 展平剧本的函数,用于提升初始化加载速度
// export const flattenCommands = (rows: Array<RuntimeCommandLike>): Array<RuntimeCommandLike> =>
//     rows.flatMap((row) => (Array.isArray(row.args) ? flattenCommands(row.args) : [row]))
