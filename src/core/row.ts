import type { CommandsKeys, StandardCommand } from './types/Command'
import type { GameRuntimeContext } from './types/Game'
import { mapValues, omit } from 'es-toolkit'
import Mustache from 'mustache'
import { match, P } from 'ts-pattern'
import book from '@/store/book'
import { log } from '@/utils/Logger'
import { commands } from './commands'
import { macros } from './commands/macros'
import { Command, CommandEntity } from './types/Command'
import { FlowEnum } from './types/Flow'

export const row = async (index: number, context: GameRuntimeContext) => {
    const row = await book.row(index)

    const commandArray = row
        // 转换json到类结构
        .map((line) => CommandEntity.from(line['@'], omit(line, ['@'])))
        // 宏展开
        .flatMap(expandMarco)
        // 过滤不存在的命令
        .filter((line) => {
            if (line.sign in commands) {
                return true
            } else {
                log.warn(`找不到命令:${line.sign}`, line.args)
                return false
            }
        }) as Array<CommandEntity<CommandsKeys>>

    const resolvedCommands = commandArray
        // 变量插值
        .map((line) =>
            CommandEntity.from(
                line.sign,
                mapValues(line.args, (value) =>
                    match(value)
                        .with(P.string, (value) => Mustache.render(value, context))
                        .otherwise((value) => value)
                )
            )
        )
        .map(({ sign, args }) => {
            const cmd = commands[sign]
            return {
                commandType: cmd.commandType,
                flowType: cmd.commandType === Command.Blocking ? FlowEnum.Await : FlowEnum.Async,
                apply: () => (cmd as StandardCommand).apply(context)(args)
            } as const
        })

    return resolvedCommands
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function expandMarco(raw: CommandEntity<any>): Array<CommandEntity<CommandsKeys>> {
    return macros.reduce(
        (acc, macro) =>
            acc.flatMap((line) => {
                if (line.sign === macro.sign) {
                    try {
                        // 难以直接验证参数合法性,选择通过异常判断
                        // @ts-expect-error 类型“unknown”的参数不能赋给类型“SetImageCommandArgs & SayCommandArgs......
                        return macro.apply(line.args)
                    } catch (e) {
                        log.error('macro转换出错:', line.args, e)
                        return []
                    }
                } else {
                    return [line]
                }
            }),
        [raw]
    )
}
