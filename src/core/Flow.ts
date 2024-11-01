import type { CommandOutput, RuntimeCommandOutput } from '@/core/type'
import { merge } from 'es-toolkit'
import { match, P } from 'ts-pattern'
import { log } from '@/utils/Logger'

// 有两种方式可以实现异步流控制,使用程序编写的代码可以直接使用await,而文字剧本则需要经过二次转换

// 标识异步流处理方式的类,实现代码与行为的分离
export class Flow<T extends Function0<ReturnType<T>>> {
    constructor(private value: T) {}
    public apply = () => this.value()
}

export class Await<T extends Function0<ReturnType<T>>> extends Flow<T> {
    constructor(value: T) {
        super(value)
    }
}

export class Async<T extends Function0<ReturnType<T>>> extends Flow<T> {
    constructor(value: T) {
        super(value)
    }
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

// 标准化ResolvedCommand,以便传入下一级流程
const normalize: Function1<MixResolvedCommand, StandardResolvedCommand> = (cmd) => {
    const flowWrapedFunction = match(cmd)
        .with(P.instanceOf(Flow), (e) => e)
        .with(P.instanceOf(Function), (e) => new Async(e))
        .exhaustive() as Flow<ResolvedCommand>

    const asyncNonNullTask = () =>
        Promise.resolve()
            .then(flowWrapedFunction.apply)
            .catch((error) => log.error('命令运行出错:', error))
            .then((result) => result ?? {})

    if (flowWrapedFunction instanceof Async) {
        return new Async(asyncNonNullTask)
    } else {
        return new Await(asyncNonNullTask)
    }
}

// 并行执行接收到全部命令,无论Flow的具体类型
// 完成时间是传入的命令中所需时间最长的那个
const _par: Function1<Array<StandardResolvedCommand>, NonNullResolvedCommand> = (array) => () =>
    Promise.all(array.map((e) => e.apply())).then((results) => results.reduce(merge, {}))

// 串行执行接收到全部命令,无论Flow的具体类型,行为相当于await cmd1();await cmd2();await cmd3()
// 完成时间是传入的所有命令所需执行时间的和
const _chain: Function1<Array<StandardResolvedCommand>, NonNullResolvedCommand> = (array) => () =>
    array.reduce((pre, e) => pre.then((all) => e.apply().then((result) => merge(all, result))), Promise.resolve({}))

// 识别Await标识的命令,行为相当于Promise.all(cmd1();await cmd2();cmd3())
// 完成时间是最后一个Await命令执行完毕之后,还在执行的命令,剩余执行时间最长的那个
const _fork: Function1<Array<StandardResolvedCommand>, NonNullResolvedCommand> = (array) => () =>
    array.reduce(
        ([context, pre], e) =>
            match(e)
                .with(P.instanceOf(Await), () =>
                    ((currentConext) => [
                        currentConext,
                        pre.then((all) => currentConext.then((result) => merge(all, result)))
                    ])(context.then(() => e.apply()))
                )
                .with(P.instanceOf(Async), () => [
                    context,
                    pre.then((all) => context.then(() => e.apply().then((result) => merge(all, result))))
                ])
                .exhaustive(),
        [Promise.resolve({}), Promise.resolve({})]
    )[1]

//export的函数自动进行标准化处理方便使用

export const par: Function1<Array<MixResolvedCommand>, NonNullResolvedCommand> = (array) => _par(array.map(normalize))

export const chain: Function1<Array<MixResolvedCommand>, NonNullResolvedCommand> = (array) =>
    _chain(array.map(normalize))

export const fork: Function1<Array<MixResolvedCommand>, NonNullResolvedCommand> = (array) => _fork(array.map(normalize))
