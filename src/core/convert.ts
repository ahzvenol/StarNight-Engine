import type { CommandRow, RuntimeCommandEntitys, RuntimeCommandLike } from './types/Command'
import { isString, negate, omit } from 'es-toolkit'
import { Try } from '@/utils/fp/Try'
import { log } from '@/utils/logger'
import { commands } from './commands'
import { macros } from './commands/macros'

export const asCommandLike = (args: CommandRow): [RuntimeCommandLike] | [] =>
    isString(args['@']) ? [{ sign: args['@'], args: args['@@'] ? args['@@'] : omit(args, ['@']) }] : []

export const expandMacro = (row: RuntimeCommandLike): Array<RuntimeCommandLike> =>
    macros.reduce<Array<RuntimeCommandLike>>(
        (acc, macro) =>
            acc.flatMap((row) => {
                if (row.sign === macro.sign) {
                    const result = Try.apply(() => macro.apply(row.args)).toEither()
                    result.left.foreach((err) => log.error(`macro转换出错:${row.sign}`, row.args, err))
                    return result.getOrElse([])
                }
                return [row]
            }),
        [row]
    )

export const isRealCommand = (row: RuntimeCommandLike): row is RuntimeCommandEntitys => row.sign in commands

export const convert = (array: Array<CommandRow>): Array<RuntimeCommandEntitys> => {
    const full = array.flatMap(asCommandLike).flatMap(expandMacro)
    full.filter(negate(isRealCommand)).forEach((row) => log.error(`找不到命令:${row.sign}`, row.args))
    return full.filter(isRealCommand)
}

// export const filterRealCommand = (rows: Array<CommandLike>): Array<CommandEntity<CommandsKeys>> =>
//     rows.filter((row) => row.sign in commands).map((row) => CommandEntity.from(row.sign as CommandsKeys, row.args))
