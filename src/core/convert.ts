import type { Macros } from '@/core/types/Marco'
import type { RuntimeCommandEntitys, RuntimeCommandLike } from './types/Command'
import { negate } from 'es-toolkit'
import { Try } from '@/utils/fp/Try'
import { log } from '@/utils/logger'
import { commands } from './commands'
import { macros } from './commands/macros'

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

export const isRealCommand = (row: RuntimeCommandLike): row is RuntimeCommandEntitys => row.key in commands()

export const convert = (array: Array<RuntimeCommandLike>): Array<RuntimeCommandEntitys> => {
    const full = array.flatMap(shallowExpandMacros)
    full.filter(negate(isRealCommand)).forEach((row) => log.error(`找不到命令:${row.key}`, row.args))
    return full.filter(isRealCommand)
}

export const deepExpandMacro = (array: Array<RuntimeCommandLike>, macro: Macros): Array<RuntimeCommandLike> =>
    array.flatMap((row) => {
        if (Array.isArray(row.args)) {
            return [{ key: row.key, args: deepExpandMacro(row.args, macro) }]
        } else if (row.key !== macro.key) {
            return [row]
        } else {
            const result = Try.apply(() => macro.apply(row.args)).toEither()
            result.left.foreach((err) => log.error(`macro转换出错:${row.key}`, row.args, err))
            return result.getOrElse([])
        }
    })

export const deepExpandMacros = (row: RuntimeCommandLike): Array<RuntimeCommandLike> =>
    macros.reduce<Array<RuntimeCommandLike>>(deepExpandMacro, [row])

export const fullExpandMacros = (array: Array<RuntimeCommandLike>): Array<RuntimeCommandLike> =>
    array.flatMap((row) => {
        if (Array.isArray(row.args)) return fullExpandMacros(row.args)
        else return deepExpandMacros(row)
    })
