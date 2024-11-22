import type { CommandArgs, CommandKeys } from './commands'
import type { StandardResolvedCommand } from './flow'
import type { GameRuntimeContext, RuntimeCommandOutput } from './type'
import { isPlainObject, mapValues, omit } from 'es-toolkit'
import Mustache from 'mustache'
import { match, P } from 'ts-pattern'
import book from '@/store/book'
import { isGenerator } from '@/utils/isGenerator'
import { log } from '@/utils/Logger'
import { commands } from './commands'
import { CommandEntity, macros } from './commands/macro'
import { onActSecondClick, onDestoryed } from './event'
import { Async, auto, Await } from './flow'
import { State } from './type'

export const row = (index: number): Promise<Array<Function1<GameRuntimeContext, StandardResolvedCommand>>> =>
    book.row(index).then((res) =>
        res
            .map((line) => CommandEntity.from(line['@'], omit(line, ['@'])))
            .flatMap((line) => {
                if (line.sign in macros) {
                    try {
                        return macros[line.sign as keyof typeof macros](line.args as unknown as never)
                    } catch (e) {
                        log.error('macro转换出错:', line.args, e)
                        return []
                    }
                } else {
                    return [line]
                }
            })
            .filter((line) => {
                if (line.sign in commands) {
                    return true
                } else {
                    log.warn(`找不到命令:${line.sign}`, line.args)
                    return false
                }
            })
            .map(
                (line) => (context: GameRuntimeContext) =>
                    CommandEntity.from(
                        line.sign as CommandKeys,
                        mapValues(line.args as object, (value) =>
                            match(value)
                                .with(P.string, (value) => Mustache.render(value, context))
                                .otherwise((value) => value)
                        ) as CommandArgs<CommandKeys>
                    )
            )
            .map((line) => (context: GameRuntimeContext) => {
                const { sign, args } = line(context)
                const cmd = commands[sign](context)
                // async标记影响Flow,function*标记影响返回值处理方式
                // 前者尽量在调用前获知,后者可以包装在函数中
                const Flow = cmd.constructor.name === 'AsyncFunction' ? Await : Async

                const onFastForward = onActSecondClick().then(() => {})
                const onDestory = onDestoryed().then(() => {})

                const imm = context.state === State.Init ? true : false
                const task = () => {
                    const output = cmd(args as unknown as never)
                    console.log(sign, output, isGenerator(output))

                    if (isGenerator(output)) {
                        return auto(output as Generator<Promise<void>, unknown, void>, {
                            imm,
                            onFastForward,
                            onDestory
                        })
                    } else {
                        return Promise.resolve(output) as Promise<RuntimeCommandOutput>
                    }
                }

                const nonNullTask = () =>
                    task()
                        .catch((error) => log.error('命令运行出错:', error))
                        .then((result) => (isPlainObject(result) ? result : {}))

                return new Flow(nonNullTask)
            })
    )
