import type { Reactive, ReactiveType } from 'micro-reactive'
import type { GlobalSaveData, ReactiveStore } from '@/store/default'
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

export type CommandArgs = Record<string, CommandArg | undefined>

export interface CommandOutput {
    continue?: boolean
    jump?: number
    end?: boolean
}

export type RuntimeCommandOutput = unknown | CommandOutput

export enum Command {
    Dynamic,
    NonBlocking,
    Blocking
}

export type DynamicCommandFunction<T extends CommandArgs = CommandArgs> = Function1<
    GameRuntimeContext,
    Function1<T, Generator<Promise<void>, RuntimeCommandOutput, void>>
>

export type NonBlockingCommandFunction<T extends CommandArgs = CommandArgs> = Function1<
    GameRuntimeContext,
    Function1<T, RuntimeCommandOutput>
>

export type BlockingCommandFunction<T extends CommandArgs = CommandArgs> = Function1<
    GameRuntimeContext,
    Function1<T, Promise<RuntimeCommandOutput>>
>

export interface DynamicCommand<T extends CommandArgs = CommandArgs> {
    type: Command.Dynamic
    apply: DynamicCommandFunction<T>
}
export interface NonBlockingCommand<T extends CommandArgs = CommandArgs> {
    type: Command.NonBlocking
    apply: NonBlockingCommandFunction<T>
}
export interface BlockingCommand<T extends CommandArgs = CommandArgs> {
    type: Command.Blocking
    apply: BlockingCommandFunction<T>
}
