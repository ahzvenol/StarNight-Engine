import type { RuntimeCommandEntitys, RuntimeCommandLike } from './types/Command'
import { negate } from 'es-toolkit'
import { Try } from '@/utils/fp/Try'
import { log } from '@/utils/logger'
import { commands } from './commands'
import { macros } from './commands/macros'

export const expandMacro = (row: RuntimeCommandLike): Array<RuntimeCommandLike> =>
    macros.reduce<Array<RuntimeCommandLike>>(
        (acc, macro) =>
            acc.flatMap((row) => {
                if (row.key === macro.key) {
                    const result = Try.apply(() => macro.apply(row.args)).toEither()
                    result.left.foreach((err) => log.error(`macro转换出错:${row.key}`, row.args, err))
                    return result.getOrElse([])
                }
                return [row]
            }),
        [row]
    )

export const isRealCommand = (row: RuntimeCommandLike): row is RuntimeCommandEntitys => row.key in commands()

export const convert = (array: Array<RuntimeCommandLike>): Array<RuntimeCommandEntitys> => {
    const full = array.flatMap(expandMacro)
    full.filter(negate(isRealCommand)).forEach((row) => log.error(`找不到命令:${row.key}`, row.args))
    return full.filter(isRealCommand)
}
