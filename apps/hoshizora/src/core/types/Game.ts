import type { Reactive } from 'micro-reactive-solid'
import type { SaveGlobalData } from '@/store/default'
import type { RuntimeCommandLike } from './Command'

export enum GameState {
    Init,
    Normal,
    Fast,
    Auto
}

export interface GameConfig {
    fastforwardunread: boolean
    autoreadspeed: number
}

export type GameBook = Array<Array<RuntimeCommandLike>>

export interface GameLocalData {
    index: number
}

export interface GameGlobalData {
    readsegment: Array<[number, number]>
}

export type GameRuntimeContext = {
    current: Reactive<GameLocalData>
    config: Reactive<GameConfig>
    global: Reactive<SaveGlobalData>
    readonly local: GameLocalData
    readonly state: GameState
    readonly immediate: Promise<void>
    readonly destroy: Promise<void>
}

export type GameStartOptions = {
    book: GameBook
    global: Reactive<SaveGlobalData>
    readonly local: GameLocalData
}
