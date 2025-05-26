import type { Signal } from 'micro-reactive-wrapper'
import type { Tagged } from 'type-fest'
import type { GameGenerator, GameRuntimeContext, GameState } from './Game'
import type { Function1 } from './Meta'

// 命令参数可能的类型
export type CommandArg = string | number | boolean

// 会在幕循环中被处理的特殊值
export type CommandOutput = {
    cont: Signal<boolean>
    jump: Signal<number | string | undefined>
    end: Signal<boolean>
    state: Signal<GameState | undefined>
    extime: Signal<Promise<unknown> | undefined>
}

// 使用生成器函数定义一个耗时无阻塞命令
export type DynamicCommand<T, R> = Function1<GameRuntimeContext, Function1<T, Generator<Promise<unknown>, R, void>>>

// 使用普通函数定义一个不耗时无阻塞命令
export type NonBlockingCommand<T, R> = Function1<GameRuntimeContext, Function1<T, R>>

// 使用异步函数定义一个耗时阻塞命令
export type BlockingCommand<T, R> = Function1<GameRuntimeContext, Function1<T, Promise<R>>>

export type MacroCommand<T, R> = Function1<GameRuntimeContext, Function1<T, GameGenerator<R>>>

enum Schedule {
    Await,
    Async
}

export type CommandTagNonBlocking = Tagged<object, Schedule.Async>

export type CommandTagBlocking = Tagged<object, Schedule.Await>

export type CommandTagDynamic = CommandTagNonBlocking & CommandTagBlocking

// 标准命令返回一个永不失败的Promise
export type StandardCommand<T, R> = Function1<T, Function1<GameRuntimeContext, Promise<R>>>

export type StandardDynamicCommand<T, R> = StandardCommand<T, R> & CommandTagDynamic

export type StandardNonBlockingCommand<T, R> = StandardCommand<T, R> & CommandTagNonBlocking

export type StandardBlockingCommand<T, R> = StandardCommand<T, R> & CommandTagBlocking
