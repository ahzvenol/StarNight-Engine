import type { MacroAble, MacroFunction } from '@/core/types/Marco'
import type { SetAudioCommandArgs } from '../script/audio'
import { CommandEntity } from '@/core/types/Command'

export const audio: MacroFunction<SetAudioCommandArgs> = (args) => {
    const array = Array<MacroAble>()
    if (args.file !== undefined) args.file = `./static/AudioClip/${args.file}.wav`
    if (args.type === 'BGM') args.loop = true
    array.push(CommandEntity.from('audio', args))
    return array
}
