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
    variables: Variables
    store: ReactiveType<Store>
    save: {
        global: Reactive<Record<string, unknown>>
        individual: IndividualSaveData
    }
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

export type CommandArgs = Record<string, string | number | boolean>

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
