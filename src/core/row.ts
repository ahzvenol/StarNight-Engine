import type { CommandsKeys } from './commands'
import type { StandardResolvedCommand } from './flow'
import type { GameRuntimeContext, RuntimeCommandOutput } from './type'
import { isPlainObject, mapValues, omit } from 'es-toolkit'
import Mustache from 'mustache'
import { match, P } from 'ts-pattern'
import book from '@/store/book'
import { log } from '@/utils/Logger'
import { commands } from './commands'
import { CommandEntity, macros } from './commands/macro'
import { onActSecondClick, onDestoryed } from './event'
import { Async, auto, Await } from './flow'
import { Command, State } from './type'

export const row = async (index: number, context: GameRuntimeContext): Promise<Array<StandardResolvedCommand>> => {
    const row = await book.row(index)

    const commandArray = row
        // 转换json到类结构
        .map((line) => CommandEntity.from(line['@'], omit(line, ['@'])))
        // 宏展开
        .flatMap((line) => {
            if (line.sign in macros) {
                try {
                    // 难以直接验证参数合法性,选择通过异常判断
                    // @ts-expect-error 类型“unknown”的参数不能赋给类型“SetImageCommandArgs & SayCommandArgs......
                    return macros[line.sign](line.args)
                } catch (e) {
                    log.error('macro转换出错:', line.args, e)
                    return []
                }
            } else {
                return [line]
            }
        })
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
            const Flow = cmd.type === Command.Blocking ? Await : Async

            const onFastForward = onActSecondClick()
            const onDestory = onDestoryed()

            const task = () => {
                if (cmd.type === Command.Dynamic) {
                    // @ts-expect-error 不能将类型“CommandArgs”分配给类型“never”。
                    const output = cmd.apply(context)(args)
                    if (context.state === State.Init) {
                        return auto(output, { imm: true })
                    } else {
                        return auto(output, { onFastForward, onDestory })
                    }
                } else {
                    // @ts-expect-error 不能将类型“CommandArgs”分配给类型“never”。
                    const output = cmd.apply(context)(args)
                    return Promise.resolve(output) as Promise<RuntimeCommandOutput>
                }
            }

            const nonNullTask = () =>
                task()
                    .catch((error) => log.error('命令运行出错:', error))
                    .then((result) => (isPlainObject(result) ? result : {}))

            return new Flow(nonNullTask)
        })

    return resolvedCommands
}
