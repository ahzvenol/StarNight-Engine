import type {
    BlockingCommandFunction,
    CommandArgs,
    CommandOutput,
    DynamicCommandFunction,
    NonBlockingCommandFunction,
    SocpedCommandFunction,
    StandardCommand
} from './types/Command'
import { isPlainObject } from 'es-toolkit'
import { log } from '@/utils/logger'
import { GameState } from './types/Game'
import { Schedule } from './types/Schedule'
import { run } from './utils/generator'

// 只在本幕内产生效果的命令,由此不需要初始化
export function ActScope<T extends CommandArgs>(
    fn: BlockingCommandFunction<T>
): BlockingCommandFunction<T> | SocpedCommandFunction<T>
export function ActScope<T extends CommandArgs>(
    fn: DynamicCommandFunction<T>
): DynamicCommandFunction<T> | SocpedCommandFunction<T>
export function ActScope<T extends CommandArgs>(
    fn: NonBlockingCommandFunction<T>
): NonBlockingCommandFunction<T> | SocpedCommandFunction<T>
export function ActScope<T extends CommandArgs>(
    fn: BlockingCommandFunction<T> | DynamicCommandFunction<T> | NonBlockingCommandFunction<T>
): BlockingCommandFunction<T> | DynamicCommandFunction<T> | NonBlockingCommandFunction<T> | SocpedCommandFunction<T> {
    return (context) => (args) => {
        if (context.state !== GameState.Init) return fn(context)(args)
    }
}
// 某些命令并不是只在本幕内产生效果,但是仍然需要跳过初始化
export { ActScope as SkipInit }
// 某些命令不需要在快进时产生效果,这样的命令应当也是ActScope的
export function SkipFast<T extends CommandArgs>(
    fn: BlockingCommandFunction<T> | SocpedCommandFunction<T>
): BlockingCommandFunction<T> | SocpedCommandFunction<T>
export function SkipFast<T extends CommandArgs>(
    fn: DynamicCommandFunction<T> | SocpedCommandFunction<T>
): DynamicCommandFunction<T> | SocpedCommandFunction<T>
export function SkipFast<T extends CommandArgs>(
    fn: NonBlockingCommandFunction<T> | SocpedCommandFunction<T>
): NonBlockingCommandFunction<T> | SocpedCommandFunction<T>
export function SkipFast<T extends CommandArgs>(
    fn: BlockingCommandFunction<T> | DynamicCommandFunction<T> | NonBlockingCommandFunction<T>
): BlockingCommandFunction<T> | DynamicCommandFunction<T> | NonBlockingCommandFunction<T> | SocpedCommandFunction<T> {
    return (context) => (args) => {
        if (context.state !== GameState.Fast) return fn(context)(args)
    }
}

function normalizeOutput(output: Function0<unknown>): Promise<CommandOutput> {
    return new Promise((res) => res(output()))
        .catch((error) => log.error('命令运行出错:', error))
        .then((result) => (isPlainObject(result) ? result : {}))
}

type DynamicType = 'Normal.Async' | 'Normal.Await' | 'Auto.Await'

export function Dynamic<T extends CommandArgs>(
    schedule: DynamicType,
    fn: DynamicCommandFunction<T> | SocpedCommandFunction<T>
): StandardCommand<T>
export function Dynamic<T extends CommandArgs>(
    fn: DynamicCommandFunction<T> | SocpedCommandFunction<T>
): StandardCommand<T>
export function Dynamic<T extends CommandArgs>(
    arg1: DynamicType | DynamicCommandFunction<T> | SocpedCommandFunction<T>,
    arg2?: DynamicCommandFunction<T> | SocpedCommandFunction<T>
): StandardCommand<T> {
    const schedule =
        arguments.length === 1 || arg1 === 'Normal.Async' || arg1 === 'Auto.Await' ? Schedule.Async : Schedule.Await
    const fn = (arguments.length === 1 ? arg1 : arg2) as DynamicCommandFunction<T> | SocpedCommandFunction<T>
    return {
        meta: {
            schedule
        },
        apply: (context) => (args) => {
            const generator = fn(context)(args) || (function* () {})()
            const output = run(generator, { immediate: context.immediate, cancel: context.cleanup })
            return normalizeOutput(() => output)
        }
    }
}

export function NonBlocking<T extends CommandArgs>(
    fn: NonBlockingCommandFunction<T> | SocpedCommandFunction<T>
): StandardCommand<T> {
    return {
        meta: {
            schedule: Schedule.Async
        },
        apply: (context) => (args) => normalizeOutput(() => fn(context)(args))
    }
}

export function Blocking<T extends CommandArgs>(
    fn: BlockingCommandFunction<T> | SocpedCommandFunction<T>
): StandardCommand<T> {
    return {
        meta: {
            schedule: Schedule.Await
        },
        apply: (context) => (args) => normalizeOutput(() => fn(context)(args))
    }
}
