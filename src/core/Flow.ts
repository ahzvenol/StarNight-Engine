import type {
    BlockingCommandFunction,
    CommandArgs,
    CommandOutput,
    DynamicCommandFunction,
    NonBlockingCommandFunction,
    StandardCommand
} from './types/Command'
import type { FlowStandardResolvedCommand, ResolvedCommand, StandardResolvedCommand } from './types/Flow'
import { isPlainObject, merge } from 'es-toolkit'
import { match } from 'ts-pattern'
import { Y } from '@/utils/FPUtil'
import { log } from '@/utils/Logger'
import { PromiseState, PromiseX, status } from '@/utils/PromiseX'
import { Command } from './types/Command'
import { FlowEnum } from './types/Flow'
import { GameState, RunState } from './types/Game'

// 有两种方式可以实现异步流控制,使用程序编写的代码可以直接使用await,而文字剧本则需要经过二次转换

// 标准化处理过程中可能遇到的命令类型
export type MixResolvedCommand = ResolvedCommand | FlowStandardResolvedCommand

export function ActScope<T extends CommandArgs>(fn: DynamicCommandFunction<T>): DynamicCommandFunction<T>
export function ActScope<T extends CommandArgs>(fn: NonBlockingCommandFunction<T>): NonBlockingCommandFunction<T>
export function ActScope<T extends CommandArgs>(
    fn: DynamicCommandFunction<T> | NonBlockingCommandFunction<T>
): DynamicCommandFunction<T> | NonBlockingCommandFunction<T> {
    return (context) => (args) => {
        if (context.state !== GameState.Init) return fn(context)(args)
    }
}

export function normalizeOutput(output: unknown): Promise<CommandOutput> {
    return Promise.resolve(output)
        .catch((error) => log.error('命令运行出错:', error))
        .then((result) => (isPlainObject(result) ? result : {}))
}

export function Dynamic<T extends CommandArgs>(fn: DynamicCommandFunction<T>): StandardCommand<T> {
    return {
        commandType: Command.Dynamic,
        apply: (context) => (args) => {
            const immediate = new PromiseX<void>((res) => {
                context.timer.addFinalizeMethod(res)
            })
            const generator = fn(context)(args)
            const output = match(context.state === GameState.Init)
                .with(true, () => exec(generator))
                .with(false, () => auto(generator, { immediate, destory: context.destory }))
                .exhaustive()
            return normalizeOutput(output)
        }
    }
}

export function NonBlocking<T extends CommandArgs>(fn: NonBlockingCommandFunction<T>): StandardCommand<T> {
    return {
        commandType: Command.NonBlocking,
        apply: (context) => (args) => normalizeOutput(fn(context)(args))
    }
}

export function Blocking<T extends CommandArgs>(fn: BlockingCommandFunction<T>): StandardCommand<T> {
    return {
        commandType: Command.Blocking,
        apply: (context) => (args) => normalizeOutput(fn(context)(args))
    }
}

export async function auto<TRetrun>(
    generator: Generator<Promise<void>, TRetrun, void>,
    { immediate = new Promise(() => {}), destory = new Promise(() => {}) }
): Promise<TRetrun | undefined> {
    const flag = (await PromiseX.status(destory)) === PromiseState.Pending ? RunState.Normal : RunState.Destroy
    return Y<RunState, Promise<TRetrun | undefined>>((rec) => async (flag) => {
        if (flag === RunState.Destroy) return
        const { value, done } = generator.next()
        if (!done) {
            if (flag === RunState.Fast) return rec(RunState.Fast)
            else
                return rec(
                    await Promise.race([
                        value.then(() => RunState.Normal),
                        immediate.then(() => RunState.Fast),
                        destory.then(() => RunState.Destroy)
                    ])
                )
        } else return value
    })(flag)
}

export function exec<TRetrun>(generator: Generator<Promise<void>, TRetrun, void>): TRetrun {
    return Y<void, TRetrun>((rec) => () => {
        const { value, done } = generator.next()
        if (!done) return rec()
        else return value
    })()
}

// 并行执行接收到全部命令,无论Flow的具体类型
// 完成时间是传入的命令中所需时间最长的那个
export const par: Function1<Array<FlowStandardResolvedCommand>, StandardResolvedCommand> = (array) => () =>
    Promise.all(array.map((e) => e.apply())).then((results) => results.reduce(merge, {}))

// 串行执行接收到全部命令,无论Flow的具体类型,行为相当于await cmd1();await cmd2();await cmd3()
// 完成时间是传入的所有命令所需执行时间的和
export const chain: Function1<Array<FlowStandardResolvedCommand>, StandardResolvedCommand> = (array) => () =>
    array.reduce((pre, e) => pre.then((all) => e.apply().then((result) => merge(all, result))), Promise.resolve({}))

// 识别Await标识的命令,行为相当于Promise.all(cmd1();await cmd2();cmd3())
// 完成时间是最后一个Await命令执行完毕之后,还在执行的命令,剩余执行时间最长的那个
export const fork: Function1<Array<FlowStandardResolvedCommand>, StandardResolvedCommand> = (array) => {
    return async () => {
        const effects = array.map((e) => ({ flowType: e.flowType, ...splitEffect(e.apply) }))
        for (const effect of effects) {
            if (effect.flowType === FlowEnum.Await) {
                await effect.execute()
            } else if (effect.flowType === FlowEnum.Async) {
                effect.execute()
            }
        }
        return Promise.all(effects.map((e) => e.result)).then((results) => results.reduce(merge, {}))
    }
}

interface Effect<T> {
    execute: Function0<Promise<void>>
    result: Promise<T>
}

// 分离副作用的实际执行与结果获取
function splitEffect<T>(executor: Function0<Promise<T>>): Effect<T> {
    const promise = new PromiseX<T>()
    return { execute: () => executor().then(promise.resolve), result: promise }
}
