import type { Reactive, ReactiveType } from 'micro-reactive'
import type { GlobalSaveData, LocalSaveData, ReactiveStore } from '@/store/default'
import type { Timer } from './Timer'

export enum State {
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
    store: ReactiveType<ReactiveStore>
    variables: Variables
}

export type GameRuntimeContext = {
    timer: Timer
    state: State
    index: number
} & GameContext

export type CommandArg = string | number | boolean

export type SingalCommand = Record<string, CommandArg | undefined>

export type CommandOutput = Record<string, unknown> & Partial<{ continue: boolean; jump: number; end: boolean }>

export type RuntimeCommandOutput = Promise<CommandOutput> | Promise<unknown> | CommandOutput | unknown

export type CommandRunFunction<T extends SingalCommand> = Function1<
    GameRuntimeContext,
    Function1<T, RuntimeCommandOutput>
>

export type CommandLifeCycleFunction = Function1<GameContext, void>