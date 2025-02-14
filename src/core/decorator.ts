import type {
    BlockingCommandFunction,
    CommandArgs,
    CommandOutput,
    DynamicCommandFunction,
    NonBlockingCommandFunction,
    StandardCommand
} from './types/Command'
import { isPlainObject } from 'es-toolkit'
import { log } from '@/utils/logger'
import { GameState } from './types/Game'
import { Schedule, Scope } from './types/Schedule'
import { run } from './utils/generator'

// 只在本幕内产生效果的命令,由此不需要初始化
export function ActScope<T extends CommandArgs>(cmd: StandardCommand<T>): StandardCommand<T> {
    delete cmd.meta.scope[GameState.Init]
    return cmd
}
// 某些命令并不是只在本幕内产生效果,但是仍然需要跳过初始化
export { ActScope as SkipInit }
// 某些命令不需要在快进时产生效果,这样的命令应当也是ActScope的
export function SkipFast<T extends CommandArgs>(cmd: StandardCommand<T>): StandardCommand<T> {
    delete cmd.meta.scope[GameState.Fast]
    return cmd
}

function normalizeOutput(output: Function0<unknown>): Promise<CommandOutput> {
    return new Promise((res) => res(output()))
        .catch((error) => log.error('命令运行出错:', error))
        .then((result) => (isPlainObject(result) ? result : {}))
}

type DynamicType = 'Normal.Async' | 'Normal.Await' | 'Auto.Await'

export function Dynamic<T extends CommandArgs>(schedule: DynamicType, fn: DynamicCommandFunction<T>): StandardCommand<T>
export function Dynamic<T extends CommandArgs>(fn: DynamicCommandFunction<T>): StandardCommand<T>
export function Dynamic<T extends CommandArgs>(
    arg1: DynamicType | DynamicCommandFunction<T>,
    arg2?: DynamicCommandFunction<T>
): StandardCommand<T> {
    const schedule =
        arguments.length === 1 || arg1 === 'Normal.Async' || arg1 === 'Auto.Await' ? Schedule.Async : Schedule.Await
    const fn = (arguments.length === 1 ? arg1 : arg2) as DynamicCommandFunction<T>
    return {
        meta: { schedule, scope: Scope() },
        apply: (context) => (args) => {
            const { immediate, cleanup: cancel } = context
            const generator = fn(context)(args)
            const output = normalizeOutput(() => run(generator, { immediate, cancel }))
            return output
        }
    }
}

export function NonBlocking<T extends CommandArgs>(fn: NonBlockingCommandFunction<T>): StandardCommand<T> {
    return {
        meta: { schedule: Schedule.Async, scope: Scope() },
        apply: (context) => (args) => normalizeOutput(() => fn(context)(args))
    }
}

export function Blocking<T extends CommandArgs>(fn: BlockingCommandFunction<T>): StandardCommand<T> {
    return {
        meta: { schedule: Schedule.Await, scope: Scope() },
        apply: (context) => (args) => normalizeOutput(() => fn(context)(args))
    }
}
