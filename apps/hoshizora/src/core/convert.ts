import type { Macros } from '@/core/types/Marco'
import type { RuntimeCommandEntitys, RuntimeCommandLike } from './types/Command'
import { log } from '@/utils/logger'
import { commands } from './commands'
import { macros } from './macros'

const isRealCommand = (row: RuntimeCommandLike): row is RuntimeCommandEntitys => row.key in commands()

// 递归过滤不存在的命令
const filterRealCommandsRecursively = (rows: Array<RuntimeCommandLike>): Array<RuntimeCommandEntitys> =>
    rows.flatMap((row) => {
        if (isRealCommand(row)) {
            if (Array.isArray(row.args)) {
                return [{ ...row, args: filterRealCommandsRecursively(row.args) }]
            } else {
                return [row]
            }
        } else {
            log.error(`找不到命令:${row.key}`, row.args)
            return []
        }
    })

// 递归应用宏到命令的每个子节点
const applyMacroToCommandNodes = (rows: Array<RuntimeCommandLike>, macro: Macros): Array<RuntimeCommandLike> =>
    rows.flatMap((row) => {
        if (Array.isArray(row.args)) {
            return [{ ...row, args: applyMacroToCommandNodes(row.args, macro) }]
        } else if (row.key !== macro.key) {
            return [row]
        } else {
            try {
                return macro.apply(row.args)
            } catch (error) {
                log.error(`macro转换出错:${row.key}`, row.args, error)
                return []
            }
        }
    })

// 对节点依次应用宏,这期间可能产生节点树
const applyMacrosToCommand = (row: RuntimeCommandLike): Array<RuntimeCommandLike> =>
    macros.reduce<Array<RuntimeCommandLike>>(applyMacroToCommandNodes, [row])

// 对每个命令节点应用转换
const applyMacrosToCommandsNodes = (rows: Array<RuntimeCommandLike>): Array<RuntimeCommandLike> =>
    rows.flatMap((row) => {
        if (Array.isArray(row.args)) return [{ ...row, args: applyMacrosToCommandsNodes(row.args) }]
        else return applyMacrosToCommand(row)
    })

// 对幕剧本执行宏转换的函数
export const convertCommands = (rows: Array<RuntimeCommandLike>): Array<RuntimeCommandEntitys> =>
    filterRealCommandsRecursively(applyMacrosToCommandsNodes(rows))

// // 展平剧本的函数,用于提升初始化加载速度
// export const flattenCommands = (rows: Array<RuntimeCommandLike>): Array<RuntimeCommandLike> =>
//     rows.flatMap((row) => (Array.isArray(row.args) ? flattenCommands(row.args) : [row]))
