import type { Signal } from 'micro-reactive-wrapper'
import type { GameFragmentGenerator, GameRuntimeContext, GameState } from './Game'

/** 会在幕循环中被处理的特殊值 */
export type CommandOutput = {
    /** 自动进入下一幕 */
    cont: Signal<boolean>,
    /** 结束剧情，停止后续执行。 */
    end: Signal<boolean>,
    /** 修改游戏状态 */
    state: Signal<GameState | undefined>,
    /** Auto状态的额外计时 */
    extime: Signal<Promise<unknown> | undefined>
}

declare const CommandTagNonBlocking: unique symbol

declare const CommandTagBlocking: unique symbol

declare const CommandTagDynamic: unique symbol

export type CommandTagNonBlocking = { [CommandTagNonBlocking]?: never }

export type CommandTagBlocking = { [CommandTagBlocking]?: never }

export type CommandTagDynamic = { [CommandTagDynamic]?: never }

export type CommandTag = CommandTagDynamic | CommandTagNonBlocking | CommandTagBlocking

/** 使用生成器函数定义一个耗时无阻塞命令 */
export type DynamicCommand<T, R> = (ctx: GameRuntimeContext & CommandTagDynamic) => (arg0: T) => Generator<Promise<unknown>, R, void>

/** 使用普通函数定义一个不耗时无阻塞命令 */
export type NonBlockingCommand<T, R> = (ctx: GameRuntimeContext & CommandTagNonBlocking) => (arg0: T) => R

/** 使用异步函数定义一个耗时阻塞命令 */
export type BlockingCommand<T, R> = (ctx: GameRuntimeContext & CommandTagBlocking) => (arg0: T) => Promise<R>

// 使用生成器函数定义一个宏命令
export type MacroCommand<T, R> = (ctx: GameRuntimeContext) => (arg0: T) => GameFragmentGenerator<R>

// Resolved命令已经传入所需参数,等待注入Context
export type StandardResolvedCommand<R> = (ctx: GameRuntimeContext) => R

// Standard命令已经捕获异常,执行永不失败
export type StandardCommand<T, R> = (arg0: T) => (ctx: GameRuntimeContext) => R

export type StandardDynamicCommand<T, R> = (arg0: T) => (ctx: GameRuntimeContext & CommandTagDynamic) => Promise<R>

export type StandardNonBlockingCommand<T, R> = (arg0: T) => (ctx: GameRuntimeContext & CommandTagNonBlocking) => R

export type StandardBlockingCommand<T, R> = (arg0: T) => (ctx: GameRuntimeContext & CommandTagBlocking) => Promise<R>
