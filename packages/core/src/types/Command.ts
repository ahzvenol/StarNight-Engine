import type { Signal } from 'micro-reactive-wrapper'
import type { Tagged } from 'type-fest'
import type { GameFragmentGenerator, GameRuntimeContext, GameState } from './Game'

/** 会在幕循环中被处理的特殊值 */
export type CommandOutput = {
    /** 自动进入下一幕 */
    cont: Signal<boolean>
    /** 结束剧情，停止后续执行。 */
    end: Signal<boolean>
    /** 修改游戏状态 */
    state: Signal<GameState | undefined>
    /** Auto状态的额外计时 */
    extime: Signal<Promise<unknown> | undefined>
}

/** 使用生成器函数定义一个耗时无阻塞命令 */
export type DynamicCommand<T, R> = Function1<GameRuntimeContext, Function1<T, Generator<Promise<unknown>, R, void>>>

/** 使用普通函数定义一个不耗时无阻塞命令 */
export type NonBlockingCommand<T, R> = Function1<GameRuntimeContext, Function1<T, R>>

/** 使用异步函数定义一个耗时阻塞命令 */
export type BlockingCommand<T, R> = Function1<GameRuntimeContext, Function1<T, Promise<R>>>

// 使用生成器函数定义一个宏命令
export type MacroCommand<T, R> = Function1<GameRuntimeContext, Function1<T, GameFragmentGenerator<R>>>

export type CommandTagNonBlocking = Tagged<object, 'Async'>

export type CommandTagBlocking = Tagged<object, 'Await'>

export type CommandTagDynamic = CommandTagNonBlocking & CommandTagBlocking

// Resolved命令已经传入所需参数,等待注入Context
export type StandardResolvedCommand<R> = Function1<GameRuntimeContext, Promise<R>>

// Standard命令返回一个永不失败的Promise
export type StandardCommand<T, R> = Function1<T, StandardResolvedCommand<R>>

export type StandardDynamicCommand<T, R> = StandardCommand<T, R> & CommandTagDynamic

export type StandardNonBlockingCommand<T, R> = StandardCommand<T, R> & CommandTagNonBlocking

export type StandardBlockingCommand<T, R> = StandardCommand<T, R> & CommandTagBlocking
