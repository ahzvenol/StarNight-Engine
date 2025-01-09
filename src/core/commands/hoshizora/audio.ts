import type { CommandEntitys } from '@/core/types/Command'
import type { MacroFunction } from '@/core/types/Marco'
import type { SetAudioCommandArgs } from '../script/audio'

export const setAudio: MacroFunction<SetAudioCommandArgs & { duration?: number }> = (args) => {
    const array = Array<CommandEntitys>()
    if (args.file !== undefined) args.file = `./static/AudioClip/${args.file}.wav`
    if (args.type === 'BGM') args.loop = true
    if (args.name === undefined) args.name = args.type
    if (args.duration) {
        array.push({
            key: 'await',
            args: [{ key: 'tweenA', args: { target: args.name, volume: 0, duration: args.duration } }]
        })
    }
    array.push({ key: 'closeA', args: { target: args.name } })
    array.push({ key: 'setA', args: Object.assign({ volume: 0 }, args) })
    array.push({ key: 'tweenA', args: { target: args.name, volume: args.volume || 1, duration: args.duration } })
    return [{ key: 'fork', args: array }]
}

export const closeAudio: MacroFunction<{ target?: string; duration?: number }> = (args) => {
    const array = Array<CommandEntitys>()
    if (args.target !== undefined) {
        array.push({
            key: 'tweenI',
            args: { volume: 0, target: args.target, duration: args.duration }
        })
        array.push({ key: 'closeA', args })
    } else {
        array.push({ key: 'closeA', args })
    }
    return array
}
