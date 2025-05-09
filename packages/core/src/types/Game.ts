/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Reactive } from 'micro-reactive-wrapper'
import type { StarNightInstance, StarNightStateStatic } from '@/StarNight'
import type { AbstractGameBook } from '../Book'
import type { CommandOutput } from './Command'
import type { Function1 } from './Meta'

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

export type GameAct<R> = Function1<
    GameRuntimeContext,
    AsyncGenerator<Function1<GameRuntimeContext, Promise<unknown>>, R, GameRuntimeContext>
>

export interface GameLocalData {
    index: number
}

export interface GameGlobalData {
    readsegment: Array<[number, number]>
}

export interface GameTempData {}

export interface GameUIExternalData {}

export interface GameUIInternalData {}

export type GameConstructorParams = {
    book: AbstractGameBook
    config: Reactive<GameConfig>
    global: Reactive<GameGlobalData>
    readonly local: GameLocalData
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
