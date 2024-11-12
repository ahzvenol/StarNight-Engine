import type { CommandArgs, CommandKeys } from '.'
import type { RuntimeCommandArgs } from '../type'
import { audio } from './hoshizora/audio'
import { setImage } from './hoshizora/image'
import { say } from './hoshizora/say'
import { video } from './hoshizora/video'

export const macros = { image: setImage, say, audio, video } as const

export type MacroCommand = {
    [K in CommandKeys]: [K, CommandArgs<K>]
}[CommandKeys]

export type Macro<T extends RuntimeCommandArgs = void> = Function1<T, Array<MacroCommand>>
