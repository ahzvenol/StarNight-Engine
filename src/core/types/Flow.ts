import type { CommandOutput, RuntimeCommandOutput } from './Command'

// 表示异步任务的通用类型
export type Task<T> = Function0<Promise<T>>

// 已经传入运行所需参数的命令
export type ResolvedCommand = Function0<RuntimeCommandOutput>

// 经过async和catch,返回值为Promise<Record>的命令
export type StandardResolvedCommand = Task<CommandOutput>

// 包装了Async或Await类型,可以被流控函数处理的命令
export type FlowStandardResolvedCommand = Flow<CommandOutput>

export enum FlowEnum {
    Await,
    Async
}

export type Flow<T> = Await<T> | Async<T>

export interface Await<T> {
    flowType: FlowEnum.Await
    apply: Task<T>
}
export interface Async<T> {
    flowType: FlowEnum.Async
    apply: Task<T>
}
