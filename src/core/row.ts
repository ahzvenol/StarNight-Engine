import type { CommandArgs, CommandKeys } from './commands'
import type { StandardResolvedCommand } from './flow'
import type { DynamicCommandReturnType, GameRuntimeContext, RuntimeCommandOutput } from './type'
import { isPlainObject, mapValues, omit } from 'es-toolkit'
import Mustache from 'mustache'
import { match, P } from 'ts-pattern'
import book from '@/store/book'
import { log } from '@/utils/Logger'
import { commands } from './commands'
import { macros } from './commands/macro'
import { Async, auto, Await } from './flow'

export const row = (index: number): Promise<Array<Function1<GameRuntimeContext, StandardResolvedCommand>>> =>
    book.row(index).then((res) =>
        res
            .map((line) => [line['@'], omit(line, ['@'])] as const)
            .flatMap(([sign, args]) => {
                if (sign in macros) {
                    try {
                        return macros[sign as keyof typeof macros](args as unknown as never)
                    } catch (e) {
                        log.error('macro转换出错:', args, e)
                        return []
                    }
                } else {
                    return [[sign, args]]
                }
            })
            .filter(([sign, args]) => {
                if (sign in commands) {
                    return true
                } else {
                    log.warn(`找不到命令:${sign}`, args)
                    return false
                }
            })
            .map(
                ([sign, args]) =>
                    (context: GameRuntimeContext) =>
                        [
                            sign as CommandKeys,
                            mapValues(args, (value) =>
                                match(value)
                                    .with(P.string, (value) => Mustache.render(value, context))
                                    .otherwise((value) => value)
                            ) as CommandArgs<CommandKeys>
                        ] as const
            )
            .map((line) => (context: GameRuntimeContext) => {
                const [sign, args] = line(context)
                const cmd = commands[sign](context)
                const Flow = match(cmd.constructor.name)
                    .with('AsyncFunction', () => Await)
                    .with('Function', () => Async)
                    .with('GeneratorFunction', () => Async)
                    .otherwise(() => Await)

                const promise = () => {
                    const output = cmd(args as unknown as never)
                    if (cmd.constructor.name === 'GeneratorFunction') {
                        return auto(output as DynamicCommandReturnType)
                    } else {
                        return Promise.resolve(output) as Promise<RuntimeCommandOutput>
                    }
                }
                return new Flow(() =>
                    promise()
                        .catch((error) => log.error('命令运行出错:', error))
                        .then((result) => (isPlainObject(result) ? result : {}))
                )
            })
    )
