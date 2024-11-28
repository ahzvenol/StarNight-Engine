import type { Macro, MacroCommand } from '../macro'
import type { SetAudioCommandArgs } from '../script/audio'
import { CommandEntity } from '../macro'

export const audio: Macro<SetAudioCommandArgs> = (args) => {
    const array = Array<MacroCommand>()
    if (args.file !== undefined) args.file = `./static/AudioClip/${args.file}.wav`
    if (args.type === 'BGM') args.loop = true
    array.push(CommandEntity.from('audio', args))
    return array
}
