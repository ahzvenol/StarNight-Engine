import type { CommandEntitys } from '@/core/types/Command'
import type { MacroFunction } from '@/core/types/Marco'
import type { SetAudioCommandArgs } from '../script/audio'

export const audio: MacroFunction<SetAudioCommandArgs> = (args) => {
    const array = Array<CommandEntitys>()
    if (args.file !== undefined) args.file = `./static/AudioClip/${args.file}.wav`
    if (args.type === 'BGM') args.loop = true
    array.push({ sign: 'audio', args })
    return array
}
