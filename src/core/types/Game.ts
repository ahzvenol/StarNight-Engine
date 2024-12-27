import type { Reactive, ReactiveType } from 'micro-reactive'
import type { GlobalSaveData, ReactiveStore } from '@/store/default'
import type { Timer } from '../utils/Timer'

export enum GameState {
    Init,
    Normal,
    Fast,
    Auto
}

export enum RunState {
    Normal,
    Fast,
    Cancel
}

export type Events = { click: Function0<void>; fast: Function0<void>; auto: Function0<void> }

export type Variables = {
    // 临时变量
    temp: Reactive<Record<string, unknown>>
    // 全局存档变量
    global: Reactive<GlobalSaveData>
    // 独立存档变量
    // 独立存档由存档命令在调用存档时从各个命令中获取数据,不通过传入方式按幕更新
    // local: Reactive<LocalSaveData>
}

export type GameContext = {
    store: ReactiveType<ReactiveStore>
    variables: Variables
}

export type GameRuntimeContext = {
    timer: Timer
    state: GameState
    index: number
    cleanup?: Promise<void>
} & GameContext

export type InitialGameData = { index: number }
