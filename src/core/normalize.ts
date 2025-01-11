import type {
    BlockingCommandFunction,
    CommandArgs,
    CommandOutput,
    DynamicCommandFunction,
    NonBlockingCommandFunction,
    SocpedCommandFunction,
    StandardCommand
} from './types/Command'
import { isPlainObject, noop } from 'es-toolkit'
import { Y } from '@/utils/fp'
import { log } from '@/utils/logger'
import { GameState } from './types/Game'
import { Schedule } from './types/Schedule'

export function ActScope<T extends CommandArgs>(
    fn: DynamicCommandFunction<T>
): DynamicCommandFunction<T> | SocpedCommandFunction<T>
export function ActScope<T extends CommandArgs>(
    fn: NonBlockingCommandFunction<T>
): NonBlockingCommandFunction<T> | SocpedCommandFunction<T>
export function ActScope<T extends CommandArgs>(
    fn: DynamicCommandFunction<T> | NonBlockingCommandFunction<T>
): DynamicCommandFunction<T> | NonBlockingCommandFunction<T> | SocpedCommandFunction<T> {
    return (context) => (args) => {
        if (context.state !== GameState.Init) return fn(context)(args)
    }
}

export function DynamicForAuto<T extends CommandArgs>(fn: DynamicCommandFunction<T>): DynamicCommandFunction<T> {
    return (context) => (args) => {
        return fn(context)(args)
    }
}

export function normalizeOutput(output: unknown): Promise<CommandOutput> {
    return Promise.resolve(output)
        .catch((error) => log.error('命令运行出错:', error))
        .then((result) => (isPlainObject(result) ? result : {}))
}

export function Dynamic<T extends CommandArgs>(
    fn: DynamicCommandFunction<T> | SocpedCommandFunction<T>
): StandardCommand<T> {
    return {
        meta: {
            schedule: Schedule.Async
        },
        apply: (context) => (args) => {
            const fast = new Promise<void>((res) => {
                context.timer.addFinalizeMethod(res)
            })
            const generator = fn(context)(args) || (function* () {})()
            const output =
                context.state === GameState.Init
                    ? runGeneratorSync(generator)
                    : runGeneratorAsyncWithControl(generator, { fast, cancel: context.cleanup })
            return normalizeOutput(output)
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
        apply: (context) => (args) => normalizeOutput(fn(context)(args))
    }
}

export function Blocking<T extends CommandArgs>(fn: BlockingCommandFunction<T>): StandardCommand<T> {
    return {
        meta: {
            schedule: Schedule.Await
        },
        apply: (context) => (args) => normalizeOutput(fn(context)(args))
    }
}

export async function runGeneratorAsyncWithControl<TRetrun>(
    generator: Generator<Promise<void>, TRetrun, void>,
    { fast = new Promise(noop), cancel = new Promise(noop) }
): Promise<TRetrun | undefined> {
    return Y<'Normal' | 'Fast' | 'Cancel', Promise<TRetrun | undefined>>((rec) => async (flag) => {
        if (flag === 'Cancel') return
        const { value, done } = generator.next()
        if (!done) {
            if (flag === 'Fast') return rec('Fast')
            else
                return rec(
                    await Promise.race([
                        value.then(() => 'Normal' as const),
                        fast.then(() => 'Fast' as const),
                        cancel.then(() => 'Cancel' as const)
                    ])
                )
        } else return value
    })('Normal')
}

export function runGeneratorSync<TRetrun>(generator: Generator<Promise<void>, TRetrun, void>): TRetrun {
    return Y<void, TRetrun>((rec) => () => {
        const { value, done } = generator.next()
        if (!done) return rec()
        else return value
    })()
}
