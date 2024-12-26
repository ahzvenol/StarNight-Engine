import type { CommandArgs, CommandEntity, CommandLike, CommandsKeys } from './types/Command'
import { isString, negate, omit } from 'es-toolkit'
import { Try } from '@/utils/fp/Try'
import { log } from '@/utils/logger'
import { commands } from './commands'
import { macros } from './commands/macros'

export const asCommandLike = (args: CommandArgs): [CommandLike] | [] =>
    isString(args['@']) ? [{ sign: args['@'], args: omit(args, ['@']) }] : []

export const expandMacro = (row: CommandLike): Array<CommandLike> =>
    macros.reduce<Array<CommandLike>>(
        (acc, macro) =>
            acc.flatMap((row) => {
                if (row.sign === macro.sign) {
                    // @ts-expect-error 类型“CommandArgs”的参数不能赋给类型“SetImageCommandArgs & ...
                    const result = Try.apply(() => macro.apply(row.args)).toEither()
                    result.left.foreach((err) => log.error(`macro转换出错:${row.sign}`, row.args, err))
                    return result.getOrElse([])
                }
                return [row]
            }),
        [row]
    )

export const isRealCommand = (row: CommandLike): row is CommandEntity<CommandsKeys> => row.sign in commands

export const convert = (array: Array<CommandArgs>): Array<CommandEntity<CommandsKeys>> => {
    const full = array.flatMap(asCommandLike).flatMap(expandMacro)
    full.filter(negate(isRealCommand)).forEach((row) => log.error(`找不到命令:${row.sign}`, row.args))
    return full.filter(isRealCommand)
}

// export const filterRealCommand = (rows: Array<CommandLike>): Array<CommandEntity<CommandsKeys>> =>
//     rows.filter((row) => row.sign in commands).map((row) => CommandEntity.from(row.sign as CommandsKeys, row.args))
