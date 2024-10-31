import { Reactive, ReactiveType } from 'micro-reactive'
import { GlobalSaveData, LocalSaveData, ReactiveStore } from '@/store/default'
import { Timer } from './Timer'

export enum State {
    Init,
    Normal,
    Fast,
    Auto
}

export type Events = { click: Function0<void>; fast: Function0<void>; auto: Function0<void> }

export type Variables = {
    // 临时变量
    temp: Reactive<LocalSaveData>
    // 全局存档变量
    global: Reactive<GlobalSaveData>
    // 独立存档变量
    local: Reactive<LocalSaveData>
}

export type GameContext = {
    store: ReactiveType<ReactiveStore>
    variables: Variables
}

export type GameRuntimeContext = {
    timer: Timer
    state: State
    row: number
} & GameContext

export type CommandArg = string | number | boolean

export type SingalCommand = Record<string, CommandArg | undefined>

export type CommandOutput = Record<string, unknown> & Partial<{ continue: boolean; jump: number; end: boolean }>

export type RuntimeCommandOutput = Promise<CommandOutput> | Promise<void> | CommandOutput | void

export type CommandRunFunction<T extends SingalCommand> = Function1<
    GameRuntimeContext,
    Function1<T, RuntimeCommandOutput>
>

export type CommandLifeCycleFunction = Function1<GameContext, void>

export type GameHooks = {
    beforeInit?: CommandLifeCycleFunction
    afterInit?: CommandLifeCycleFunction
    beforeActStart?: CommandLifeCycleFunction
    onLeft?: CommandLifeCycleFunction
    onActivated?: CommandLifeCycleFunction
    onDeactivated?: CommandLifeCycleFunction
}