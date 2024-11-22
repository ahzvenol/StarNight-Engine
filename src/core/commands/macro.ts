import type { CommandArgs, CommandKeys } from '.'
import type { RuntimeCommandArgs } from '../type'
import { audio } from './hoshizora/audio'
import { setImage } from './hoshizora/image'
import { say } from './hoshizora/say'
import { video } from './hoshizora/video'

export const macros = { image: setImage, say, audio, video } as const

export type MacroCommand = {
    [K in CommandKeys]: CommandEntity<K>
}[CommandKeys]

export class CommandEntity<T extends CommandKeys> {
    constructor(
        public readonly sign: T,
        public readonly args: CommandArgs<T>
    ) {}
    static from<T extends CommandKeys>(sign: T, args: CommandArgs<T>): CommandEntity<T> {
        return new CommandEntity(sign, args)
    }
}

export type Macro<T extends RuntimeCommandArgs = void> = Function1<T, Array<MacroCommand>>
