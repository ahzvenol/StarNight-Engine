import type { Reactive } from 'micro-reactive-solid'
import type { RuntimeCommandEntities, RuntimeCommandLike } from './Command'
import { StarNight } from '@/StarNight'
import { GameBook } from '../Book'

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

export interface GameTempData {}

export interface GameUIData {}

export type GameRuntimeContext = {
    current: Reactive<GameLocalData>
    config: Reactive<GameConfig>
    global: Reactive<GameGlobalData>
    ui: GameUIData
    temp: GameTempData
    readonly local: GameLocalData
    readonly state: GameState
    readonly onActRush: Promise<void>
    readonly onGameDestroy: Promise<void>
    readonly instance: StarNight
}

export type GameStartOptions = {
    book: GameBook
    config: Reactive<GameConfig>
    global: Reactive<GameGlobalData>
    readonly local: GameLocalData
}
