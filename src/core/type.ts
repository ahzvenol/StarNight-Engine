import type { Reactive, ReactiveType } from 'micro-reactive'
import type { GlobalSaveData, ReactiveStore } from '@/store/default'
import type { Timer } from './Timer'
import { initData } from './Core'

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

export type RuntimeCommandArgs = Record<string, CommandArg | undefined> | void

export type CommandOutput = Record<string, unknown> & Partial<{ continue: boolean; jump: number; end: boolean }>

type Ignore = unknown

export type RuntimeCommandOutput = CommandOutput | Ignore

export type DynamicCommandReturnType = Generator<Promise<Ignore>, RuntimeCommandOutput, Ignore>

export enum Command {
    Dynamic,
    NonBlocking,
    Blocking
}

export type DynamicCommand<T extends RuntimeCommandArgs = void> = Function1<
    GameRuntimeContext,
    Function1<T, DynamicCommandReturnType>
>

export type NonBlockingCommand<T extends RuntimeCommandArgs = void> = Function1<
    GameRuntimeContext,
    Function1<T, RuntimeCommandOutput>
>

export type BlockingCommand<T extends RuntimeCommandArgs = void> = Function1<
    GameRuntimeContext,
    Function1<T, Promise<RuntimeCommandOutput>>
>

export type IDynamicCommand<T extends RuntimeCommandArgs = void> = {
    type: Command.Dynamic
    apply: DynamicCommand<T>
}
export type INonBlockingCommand<T extends RuntimeCommandArgs = void> = {
    type: Command.NonBlocking
    apply: NonBlockingCommand<T>
}
export type IBlockingCommand<T extends RuntimeCommandArgs = void> = {
    type: Command.Dynamic
    apply: BlockingCommand<T>
}
