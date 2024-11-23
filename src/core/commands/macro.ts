import type { CommandsArgs, CommandsKeys } from '.'
import type { CommandArgs } from '../type'
import { audio } from './hoshizora/audio'
import { setImage } from './hoshizora/image'
import { say } from './hoshizora/say'
import { video } from './hoshizora/video'

export const macros = { image: setImage, say, audio, video } as const

export type MacroCommand = {
    [K in CommandsKeys]: CommandEntity<K>
}[CommandsKeys]

export class CommandEntity<T extends CommandsKeys> {
    private constructor(
        public readonly sign: T,
        public readonly args: CommandsArgs<T>
    ) {}
    static from<T extends CommandsKeys>(sign: T, args: CommandsArgs<T>): CommandEntity<T> {
        return new CommandEntity(sign, args)
    }
}

export type Macro<T extends CommandArgs = CommandArgs> = Function1<T, Array<MacroCommand>>
