import type { Macros } from '@/core/types/Marco'
import type { RuntimeCommandEntitys, RuntimeCommandLike } from './types/Command'
import { negate } from 'es-toolkit'
import { Try } from '@/utils/fp/Try'
import { log } from '@/utils/logger'
import { commands } from './commands'
import { macros } from './commands/macros'

export const isRealCommand = (row: RuntimeCommandLike): row is RuntimeCommandEntitys => row.key in commands()

// 应用宏到表层节点,忽略子节点
export const shallowExpandMacros = (row: RuntimeCommandLike): Array<RuntimeCommandLike> =>
    macros.reduce<Array<RuntimeCommandLike>>(
        (acc, macro) =>
            acc.flatMap((row) => {
                if (row.key !== macro.key) return [row]
                const result = Try.apply(() => macro.apply(row.args)).toEither()
                result.left.foreach((err) => log.error(`macro转换出错:${row.key}`, row.args, err))
                return result.getOrElse([])
            }),
        [row]
    )

export const shallowConvert = (rows: Array<RuntimeCommandLike>): Array<RuntimeCommandEntitys> => {
    const full = rows.flatMap(shallowExpandMacros)
    full.filter(negate(isRealCommand)).forEach((row) => log.error(`找不到命令:${row.key}`, row.args))
    return full.filter(isRealCommand)
}

// 递归过滤不存在的命令
export const deepFilterRealCommand = (rows: Array<RuntimeCommandLike>): Array<RuntimeCommandEntitys> =>
    rows.flatMap((row) => {
        if (isRealCommand(row)) {
            if (Array.isArray(row.args)) {
                return [{ key: row.key, args: deepFilterRealCommand(row.args) }]
            } else {
                return [row]
            }
        } else {
            log.error(`找不到命令:${row.key}`, row.args)
            return []
        }
    })

// 递归应用宏到命令的每个子节点
export const deepExpandMacro = (rows: Array<RuntimeCommandLike>, macro: Macros): Array<RuntimeCommandLike> =>
    rows.flatMap((row) => {
        if (Array.isArray(row.args)) {
            return [{ key: row.key, args: deepExpandMacro(row.args, macro) }]
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
export const deepExpandMacros = (row: RuntimeCommandLike): Array<RuntimeCommandLike> =>
    macros.reduce<Array<RuntimeCommandLike>>(deepExpandMacro, [row])

// 对每个命令节点应用转换
export const fullExpandMacros = (rows: Array<RuntimeCommandLike>): Array<RuntimeCommandLike> =>
    rows.flatMap((row) => {
        if (Array.isArray(row.args)) return [{ key: row.key, args: fullExpandMacros(row.args) }]
        else return deepExpandMacros(row)
    })

export const fullConvert = (rows: Array<RuntimeCommandLike>): Array<RuntimeCommandEntitys> =>
    deepFilterRealCommand(fullExpandMacros(rows))
