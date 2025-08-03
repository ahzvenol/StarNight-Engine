/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Reactive } from 'micro-reactive-wrapper'
import type { Except } from 'type-fest'
import type { StarNightInstance, StarNightStateStatic } from '@/StarNight'
import type { CommandOutput, StandardResolvedCommand } from './Command'

export enum GameState {
    Initializing = 0,
    Normal = 1,
    Fast = 2,
    Auto = 3
}

export interface GameConfig {
    fastforwardunread: boolean
    fastreadspeed: number
    autoreadspeed: number
}

export type GameFragmentGenerator<R> = Generator<unknown, R, unknown>

export type GameFragment<R> = Function1<GameRuntimeContext, GameFragmentGenerator<R>>

export type GameScenario<R> = Generator<GameFragment<R>, unknown, unknown>

export type GameScript = GameScenario<number>

/** 游戏本地数据 */
export interface GameLocalData {
    count: number
    index: number
    sence: string
    input: Array<unknown>
}

/** 游戏全局数据 */
export interface GameGlobalData {
    readsegment: Record<string, Array<[number, number]>>
}

/** 游戏实例临时数据 */
export interface GameTempData {
    input: ArrayIterator<unknown>
}

/** 游戏外部UI数据，由外部传入 */
export interface GameUIExternalData {}

/** 游戏内部UI数据，由内部设置 */
export interface GameUIInternalData {}

export type GameConstructorParams = {
    /** 游戏剧本 */
    script: GameScript
    /** 游戏设置 */
    config: Reactive<GameConfig>
    /** 游戏全局数据 */
    global: Reactive<GameGlobalData>
    /** 游戏存档数据 */
    readonly local: { count: number } & Partial<GameLocalData>
    /** 游戏外部UI数据 */
    ui: GameUIExternalData
}

/** 游戏实例上下文 */
export type GameContext = {
    /** 游戏实时数据 */
    current: Reactive<GameLocalData>
    /** 游戏临时数据 */
    temp: GameTempData
    /** 游戏UI数据 */
    ui: GameUIInternalData
    /** 游戏实例 */
    readonly instance: StarNightInstance
} & Except<GameConstructorParams, 'script'>

/** 单幕上下文 */
export type GameRuntimeContext = {
    /** 游戏当前幕的状态 */
    readonly state: StarNightStateStatic
    /** 游戏当前幕的特殊输出 */
    readonly output: CommandOutput
    /** 游戏当前幕的快进Promise */
    readonly onActRush: Promise<GameRuntimeContext>
    /** 游戏全局的结束Promise */
    readonly onGameStop: Promise<GameContext>
} & GameContext
