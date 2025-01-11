import type { CommandOutput, HighLevelCommandFunction, RuntimeCommandOutput } from './Command'
import type { MetaFunction } from './Meta'

// 通用类型,表示永远不会失败的Promise
export type NeverFailingPromise<T> = Promise<T>

// Resolved命令已经传入全部参数
export type ResolvedCommandFunction = Function0<RuntimeCommandOutput>

// 具有Resolved和Standard性质的命令
export type StandardResolvedCommandFunction = Function0<NeverFailingPromise<CommandOutput>>

// 使用这两个标记的目的是使用外部数据对象控制程序的阻塞/并行调度
export enum Schedule {
    Await = 'await',
    Async = 'async'
}

export interface ScheduledHighLevelCommand extends MetaFunction {
    meta: { schedule: Schedule }
    apply: HighLevelCommandFunction
}

export interface ScheduledStandardResolvedCommand extends MetaFunction {
    meta: {
        schedule: Schedule
    }
    apply: StandardResolvedCommandFunction
}
