import type { Macro, MacroCommand } from '../macro'
import type { AudioCommandArgs } from '../script/audio'

export const audio: Macro<AudioCommandArgs> = (args) => {
    const array = Array<MacroCommand>()
    if (args.file !== undefined) args.file = `./static/AudioClip/${args.file}.wav`
    if (args.type === 'BGM') args.loop = true
    array.push(['audio', args])
    return array
}
