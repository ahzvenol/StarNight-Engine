import type {
    BlockingCommand,
    BlockingCommandFunction,
    CommandArgs,
    DynamicCommand,
    DynamicCommandFunction,
    NonBlockingCommand,
    NonBlockingCommandFunction
} from './types/Command'
import type { NonNullResolvedCommand, ResolvedCommand, StandardResolvedCommand } from './types/Flow'
import { merge } from 'es-toolkit'
import { Y } from '@/utils/FPUtil'
import { PromiseX } from '@/utils/PromiseX'
import { Command } from './types/Command'
import { FlowEnum } from './types/Flow'
import { State } from './types/Game'

// 有两种方式可以实现异步流控制,使用程序编写的代码可以直接使用await,而文字剧本则需要经过二次转换

// 标准化处理过程中可能遇到的命令类型
export type MixResolvedCommand = ResolvedCommand | StandardResolvedCommand

export function ActScope<T extends CommandArgs>(fn: DynamicCommandFunction<T>): DynamicCommandFunction<T>
export function ActScope<T extends CommandArgs>(fn: NonBlockingCommandFunction<T>): NonBlockingCommandFunction<T>
export function ActScope<T extends CommandArgs>(
    fn: DynamicCommandFunction<T> | NonBlockingCommandFunction<T>
): DynamicCommandFunction<T> | NonBlockingCommandFunction<T> {
    return (context) => (args) => {
        if (context.state !== State.Init) return fn(context)(args)
    }
}

export function Dynamic<T extends CommandArgs = CommandArgs>(fn: DynamicCommandFunction<T>) {
    return {
        commandType: Command.Dynamic,
        apply: fn
    } as DynamicCommand<T>
}

export function NonBlocking<T extends CommandArgs = CommandArgs>(fn: NonBlockingCommandFunction<T>) {
    return {
        commandType: Command.NonBlocking,
        apply: fn
    } as NonBlockingCommand<T>
}

export function Blocking<T extends CommandArgs = CommandArgs>(fn: BlockingCommandFunction<T>) {
    return {
        commandType: Command.Blocking,
        apply: fn
    } as BlockingCommand<T>
}

export function auto<TRetrun>(
    generator: Generator<Promise<void>, TRetrun, void>,
    {
        imm,
        onFastForward,
        onDestory
    }: XOR<{ imm: true }, { onFastForward?: Promise<unknown>; onDestory?: Promise<unknown> }>
): Promise<TRetrun> {
    onDestory?.then(() => generator.throw(new Error('Destoryed')))
    return Y<boolean, Promise<TRetrun>>((rec) => async (flag) => {
        const { value, done } = generator.next()
        if (!done) {
            if (flag) return rec(true)
            else if (onFastForward !== undefined) {
                return Promise.race([onFastForward.then(() => true), value.then(() => false)]).then((flag) => rec(flag))
            } else return value.then(() => rec(false))
        } else return value
    })(imm || false)
}

// 并行执行接收到全部命令,无论Flow的具体类型
// 完成时间是传入的命令中所需时间最长的那个
export const par: Function1<Array<StandardResolvedCommand>, NonNullResolvedCommand> = (array) => () =>
    Promise.all(array.map((e) => e.apply())).then((results) => results.reduce(merge, {}))

// 串行执行接收到全部命令,无论Flow的具体类型,行为相当于await cmd1();await cmd2();await cmd3()
// 完成时间是传入的所有命令所需执行时间的和
export const chain: Function1<Array<StandardResolvedCommand>, NonNullResolvedCommand> = (array) => () =>
    array.reduce((pre, e) => pre.then((all) => e.apply().then((result) => merge(all, result))), Promise.resolve({}))

// 识别Await标识的命令,行为相当于Promise.all(cmd1();await cmd2();cmd3())
// 完成时间是最后一个Await命令执行完毕之后,还在执行的命令,剩余执行时间最长的那个
export const fork: Function1<Array<StandardResolvedCommand>, NonNullResolvedCommand> = (array) => {
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
