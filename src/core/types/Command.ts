import type { commands } from '../commands'
import type { Flow } from './Flow'
import type { GameRuntimeContext } from './Game'
import type { MetaFunction } from './Meta'

export type CommandArg = string | number | boolean | Array<CommandArgs>

export type CommandArgs = Record<string, CommandArg | undefined>

export interface CommandOutput {
    continue?: boolean
    jump?: number
    end?: boolean
}

export type RuntimeCommandOutput = unknown | CommandOutput

export type SocpedCommandFunction<T extends CommandArgs = CommandArgs> = Function1<
    GameRuntimeContext,
    Function1<T, undefined>
>
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

export type CommandFunction<T extends CommandArgs = CommandArgs> =
    | SocpedCommandFunction<T>
    | DynamicCommandFunction<T>
    | NonBlockingCommandFunction<T>
    | BlockingCommandFunction<T>

export type StandardCommandFunction<T extends CommandArgs = CommandArgs> = Function1<
    GameRuntimeContext,
    Function1<T, Promise<CommandOutput>>
>

export interface StandardCommand<T extends CommandArgs = CommandArgs> extends MetaFunction {
    meta: { flow: Flow }
    apply: StandardCommandFunction<T>
}

export type Commands = typeof commands

export type CommandsKeys = keyof Commands

export type CommandLike = {
    readonly sign: string
    readonly args: CommandArgs
}

export type CommandsArgs<T extends CommandsKeys> = Parameters<ReturnType<Commands[T]['apply']>>[0]

export interface CommandEntity<T extends CommandsKeys> {
    readonly sign: T
    readonly args: CommandsArgs<T>
}

export type CommandEntitys = CommandEntity<CommandsKeys>
