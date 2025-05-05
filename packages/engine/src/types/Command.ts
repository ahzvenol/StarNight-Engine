import type { Signal } from 'micro-reactive-wrapper'
import type { GameRuntimeContext, GameState } from './Game'
import type { Function1, NeverFailingPromise } from './Meta'

// 命令参数可能的类型
export type CommandArg = string | number | boolean

// 会在幕循环中被处理的特殊值
export type CommandOutput = {
    cont: Signal<boolean>
    jump: Signal<number | string | undefined>
    end: Signal<boolean>
    state: Signal<GameState | undefined>
}

// 使用生成器函数定义一个耗时无阻塞命令
export type DynamicCommand<T> = Function1<GameRuntimeContext, Function1<T, Generator<Promise<unknown>, unknown, void>>>

// 使用普通函数定义一个不耗时无阻塞命令
export type NonBlockingCommand<T> = Function1<GameRuntimeContext, Function1<T, unknown>>

// 使用异步函数定义一个耗时阻塞命令
export type BlockingCommand<T> = Function1<GameRuntimeContext, Function1<T, Promise<unknown>>>

export type MacroCommand<T> = Function1<
    GameRuntimeContext,
    Function1<T, AsyncGenerator<Function1<GameRuntimeContext, Promise<unknown>>, void, GameRuntimeContext>>
>

// 标准命令返回一个永不失败的Promise
export type StandardCommand<T> = Function1<T, Function1<GameRuntimeContext, NeverFailingPromise<unknown>>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Commands = Record<string, StandardCommand<any>>
