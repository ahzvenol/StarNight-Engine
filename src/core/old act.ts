import type { CommandsKeys, StandardCommand } from './types/Command'
import type { GameRuntimeContext } from './types/Game'
import { groupBy, mapValues, omit } from 'es-toolkit'
import Mustache from 'mustache'
import { match, P } from 'ts-pattern'
import book from '@/store/book'
import { log } from '@/utils/logger'
import { commands } from './commands'
import { macros } from './commands/macros'
import { Command, CommandEntity } from './types/Command'
import { Flow } from './types/Flow'

const KEYWORDS = ['par', 'chain', 'fork', 'if', 'await', 'async'] as const

export const act = async (index: number, context: GameRuntimeContext) => {
    const act = await book.act(index)

    // row.map((line) => {
    //     if (KEYWORDS.includes(line['@'])) {
    //     } else if (macros.some((macro) => macro.sign === line['@'])) {
    //         return Try.apply(() =>
    //             macros.reduce<Array<E>>(
    //                 (acc, macro) =>
    //                     acc.flatMap((e) => {
    //                         return match(e)
    //                             .with(P.instanceOf(Right), (right) => {
    //                                 const value = right.get()
    //                                 if (value.sign === macro.sign) {
    //                                     return match(Try.apply(() => macro.apply(value.args as never)))
    //                                         .with(P.instanceOf(Success), (success) => {
    //                                             const result = success.value as Array<CommandEntity<CommandsKeys>>
    //                                             return result.map((e) => Either.right(e))
    //                                         })
    //                                         .with(P.instanceOf(Failure), (failure) =>
    //                                             Either.left({ error: `找不到命令:${value.sign}`, data: failure.error })
    //                                         )
    //                                         .otherwise(noop) as E
    //                                 } else {
    //                                     return [right]
    //                                 }
    //                             })
    //                             .otherwise((left) => [left])
    //                         // log.error('macro转换出错:', line.args, e)
    //                     }),
    //                 [Either.right({ sign: line['@'], args: omit(line, ['@']) })]
    //             )
    //         )
    //     } else if (line['@'] in commands) {
    //         return Either.right(CommandEntity.from<CommandsKeys>(line['@'], omit(line, ['@'])))
    //     } else {
    //         return Either.left({ error: `找不到命令:${line['@']}`, data: line })
    //     }
    // })
    // 过滤不存在的命令
    const { valid = [], invalid } = groupBy(await book.row(index), (line) =>
        line['@'] in commands || macros.some((macro) => macro.sign === line['@']) ? 'valid' : 'invalid'
    )

    invalid?.forEach((line) => log.warn(`找不到命令:${line['@']}`, line))

    const result = valid
        // 转换json到类结构
        .map((line) => CommandEntity.from(line['@'], omit(line, ['@'])) as CommandEntity<CommandsKeys>)
        // 宏展开
        .flatMap((raw) =>
            macros.reduce(
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
        )
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
                meta: {
                    command: cmd.meta.command,
                    flow: cmd.meta.command === Command.Blocking ? Flow.Await : Flow.Async
                },
                apply: () => (cmd as StandardCommand).apply(context)(args)
            } as const
        })

    return result
}
