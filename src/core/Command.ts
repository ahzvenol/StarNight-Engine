import { IndividualSaveData, Store } from '@/store/default'
import { Reactive, ReactiveType } from 'micro-reactive'
import { Timer } from './Timer'
import { Variables } from './Core'

export enum State {
    Init,
    Normal,
    Fast,
    Auto
}

export type GameContext = {
    stage: createjs.Stage
    store: ReactiveType<Store>
    // 临时变量
    variables: Variables
    // 全局存档变量
    global: Reactive<Record<string, unknown>>
    // 独立存档变量
    individual: IndividualSaveData
}

export type GameRuntimeContext = {
    timer: Timer
    state: State
    row: number
} & GameContext

// export type Args = {
//     name: string
//     target: string | number
//     file: string
//     duration: number
//     transition: string
//     text: string
//     number: number
//     bool: boolean
//     value: string | number | boolean
// }

export type CommandArgTypes = string | number | boolean

export type CommandArgs = Record<string, CommandArgTypes>

export type CommandOutput = Record<string, unknown> & Partial<{ continue: boolean; jump: number; end: boolean }>

export type RuntimeCommandOutput = Promise<CommandOutput> | Promise<void> | CommandOutput | void

export type CommandRunFunction<T extends CommandArgs> = Function1<
    GameRuntimeContext,
    Function1<T, RuntimeCommandOutput>
>

export type CommandLifeCycleFunction = Function1<GameContext, void>

export type GameHooks = {
    beforeInit?: CommandLifeCycleFunction
    afterInit?: CommandLifeCycleFunction
    onActStart?: CommandLifeCycleFunction
}
