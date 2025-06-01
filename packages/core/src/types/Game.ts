/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Reactive } from 'micro-reactive-wrapper'
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

export type GameMacroGenerator<R> = Generator<StandardResolvedCommand<unknown> | Promise<unknown>, R, unknown>

export type GameFragmentGenerator<R> = AsyncGenerator<StandardResolvedCommand<unknown>, R, unknown>

export type GameFragment<R> = Function1<GameRuntimeContext, GameFragmentGenerator<R>>

export type GameMacro<R> = Function1<GameRuntimeContext, GameMacroGenerator<R>>

export type GameScenario<R> = Generator<GameFragment<R>, unknown, unknown>

export interface GameLocalData {
    count: number
    index: number
    sence: string
}

export interface GameGlobalData {
    readsegment: Record<string, Array<[number, number]>>
}

export interface GameTempData {}

export interface GameUIExternalData {}

export interface GameUIInternalData {}

export type GameConstructorParams = {
    scenario: GameScenario<number>
    config: Reactive<GameConfig>
    global: Reactive<GameGlobalData>
    readonly local: { count: number } & Partial<GameLocalData>
    ui: GameUIExternalData
}

export type GameContext = {
    current: Reactive<GameLocalData>
    temp: GameTempData
    ui: GameUIInternalData
    readonly instance: StarNightInstance
} & Omit<GameConstructorParams, 'book'>

export type GameRuntimeContext = {
    readonly state: StarNightStateStatic
    readonly output: CommandOutput
    readonly onActRush: Promise<GameRuntimeContext>
    readonly onGameStop: Promise<GameContext>
} & GameContext
