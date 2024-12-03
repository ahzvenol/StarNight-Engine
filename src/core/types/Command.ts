import type { commands } from '../commands'
import type { GameRuntimeContext } from './Game'

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

export interface StandardCommand<T extends CommandArgs = CommandArgs> {
    commandType: Command
    apply: Function1<GameRuntimeContext, Function1<T, Promise<CommandOutput>>>
}

export interface DynamicCommand<T extends CommandArgs = CommandArgs> {
    commandType: Command.Dynamic
    apply: DynamicCommandFunction<T>
}
export interface NonBlockingCommand<T extends CommandArgs = CommandArgs> {
    commandType: Command.NonBlocking
    apply: NonBlockingCommandFunction<T>
}
export interface BlockingCommand<T extends CommandArgs = CommandArgs> {
    commandType: Command.Blocking
    apply: BlockingCommandFunction<T>
}

export type Commands = typeof commands

export type CommandsKeys = keyof Commands

export type CommandsArgs<T extends CommandsKeys> = Parameters<ReturnType<Commands[T]['apply']>>[0]

export class CommandEntity<T extends CommandsKeys> {
    private constructor(
        public readonly sign: T,
        public readonly args: CommandsArgs<T>
    ) {}
    static from<T extends CommandsKeys>(sign: T, args: CommandsArgs<T>): CommandEntity<T> {
        return new CommandEntity(sign, args)
    }
}
