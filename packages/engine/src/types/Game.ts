import type { Reactive } from 'micro-reactive-wrapper'
import type { StarNightInstance } from '@/StarNight'
import type { AbstractGameBook } from '../Book'
import type { RuntimeCommandEntities, RuntimeCommandLike } from './Command'

export enum GameState {
    Init,
    Normal,
    Fast,
    Auto
}

export interface GameConfig {
    fastforwardunread: boolean
    fastreadspeed: number
    autoreadspeed: number
}

export type GameActRaw = Array<RuntimeCommandLike>
export type GameBookRaw = Array<GameActRaw>

export type GameActProcessed = Array<RuntimeCommandEntities>
export type GameBookProcessed = Array<GameActProcessed>

export interface GameLocalData {
    index: number
}

export interface GameGlobalData {
    readsegment: Array<[number, number]>
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GameTempData {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GameUIExternalData {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
    isRead: Reactive<boolean>
    isGameVisible: Reactive<boolean>
    readonly instance: StarNightInstance
} & Omit<GameConstructorParams, 'book'>

export type GameRuntimeContext = {
    readonly state: GameState
    readonly onActRush: Promise<GameRuntimeContext>
    readonly onGameStop: Promise<GameContext>
} & GameContext
