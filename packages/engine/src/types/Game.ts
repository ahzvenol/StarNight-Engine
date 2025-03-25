import type { Reactive } from 'micro-reactive-solid'
import type { RuntimeCommandEntities, RuntimeCommandLike } from './Command'
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

export type GameRuntimeContext = {
    current: Reactive<GameLocalData>
    config: Reactive<GameConfig>
    global: Reactive<GameGlobalData>
    readonly local: GameLocalData
    readonly state: GameState
    readonly immediate: Promise<void>
    readonly destroy: Promise<void>
}

export type GameStartOptions = {
    book: GameBook
    global: Reactive<GameGlobalData>
    readonly local: GameLocalData
}
