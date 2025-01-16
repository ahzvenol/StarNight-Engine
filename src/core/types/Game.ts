import type { Reactive, ReactiveType } from 'micro-reactive'
import type { GlobalSaveData, LocalSaveData, ReactiveStore } from '@/store/default'

export enum GameState {
    Init,
    Normal,
    Fast,
    Auto
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
    variables: Variables
    readonly store: ReactiveType<ReactiveStore>
}

export type GameRuntimeContext = {
    initial: InitialGameData
    readonly state: GameState
    readonly index: number
    readonly immediate: Promise<void>
    readonly cleanup: Promise<void>
} & GameContext

// 存档中对初始化有效的参数目前只有index和select,其中index由初始化消耗,select由sel命令消耗
export type InitialGameData = Pick<LocalSaveData, 'index' | 'select'>
