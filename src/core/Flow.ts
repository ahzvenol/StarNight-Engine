import type {
    BlockingCommand,
    BlockingCommandFunction,
    CommandArgs,
    CommandOutput,
    DynamicCommand,
    DynamicCommandFunction,
    NonBlockingCommand,
    NonBlockingCommandFunction,
    RuntimeCommandOutput
} from '@/core/type'
import { merge } from 'es-toolkit'
import { Command, State } from '@/core/type'
import { Y } from '@/utils/FPUtil'

// 有两种方式可以实现异步流控制,使用程序编写的代码可以直接使用await,而文字剧本则需要经过二次转换

export type Flow<T extends Function0<ReturnType<T>>> = Await<T> | Async<T>

// 标识异步流处理方式的类,实现代码与行为的分离
abstract class AbstractFlow<T extends Function0<ReturnType<T>>> {
    constructor(protected value: T) {}
    public apply = () => this.value()
    public abstract map<R extends Function0<ReturnType<R>>>(fn: Function1<T, R>): Flow<R>
}

export class Await<T extends Function0<ReturnType<T>>> extends AbstractFlow<T> {
    constructor(value: T) {
        super(value)
    }
    public map = <R extends Function0<ReturnType<R>>>(fn: Function1<T, R>): Flow<R> => new Await(fn(this.value))
}

export class Async<T extends Function0<ReturnType<T>>> extends AbstractFlow<T> {
    constructor(value: T) {
        super(value)
    }
    public map = <R extends Function0<ReturnType<R>>>(fn: Function1<T, R>): Flow<R> => new Async(fn(this.value))
}

// 表示异步任务的通用类型
export type AsyncTask<T> = Function0<Promise<T>>

// 已经传入运行所需参数的命令
export type ResolvedCommand = Function0<RuntimeCommandOutput>

// 经过async和catch,返回值为Promise<Record>的命令
export type NonNullResolvedCommand = AsyncTask<CommandOutput>

// 包装了Async或Await类型,可以被流控函数处理的命令
export type StandardResolvedCommand = Flow<NonNullResolvedCommand>

// 标准化处理过程中可能遇到的命令类型
export type MixResolvedCommand = ResolvedCommand | Flow<ResolvedCommand> | StandardResolvedCommand

export function ActScope<T extends CommandArgs>(fn: DynamicCommandFunction<T>): DynamicCommandFunction<T>
export function ActScope<T extends CommandArgs>(fn: NonBlockingCommandFunction<T>): NonBlockingCommandFunction<T>
export function ActScope<T extends CommandArgs>(
    fn: DynamicCommandFunction<T> | NonBlockingCommandFunction<T>
): DynamicCommandFunction<T> | NonBlockingCommandFunction<T> {
    return (context) => (args) => {
        if (context.state !== State.Init) return fn(context)(args)
    }
}

export function Dynamic<T extends CommandArgs = CommandArgs>(fn: DynamicCommandFunction<T>): DynamicCommand<T> {
    return {
        type: Command.Dynamic,
        apply: fn
    }
}

export function NonBlocking<T extends CommandArgs = CommandArgs>(
    fn: NonBlockingCommandFunction<T>
): NonBlockingCommand<T> {
    return {
        type: Command.NonBlocking,
        apply: fn
    }
}

export function Blocking<T extends CommandArgs = CommandArgs>(fn: BlockingCommandFunction<T>): BlockingCommand<T> {
    return {
        type: Command.Blocking,
        apply: fn
    }
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
export const fork: Function1<Array<StandardResolvedCommand>, StandardResolvedCommand> = (array) => {
    return new Async(async () => {
        const promises = new Array<Promise<CommandOutput>>()
        for (const cmd of array) {
            if (cmd instanceof Await) {
                const promise = cmd.apply()
                await promise
                promises.push(promise)
            } else if (cmd instanceof Async) {
                promises.push(cmd.apply())
            }
        }
        return Promise.all(promises).then((results) => results.reduce(merge, {}))
    })
}
