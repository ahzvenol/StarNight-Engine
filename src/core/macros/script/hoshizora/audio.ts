import type { SetAudioCommandArgs } from '@/core/commands/script/audio'
import type { CommandEntitys } from '@/core/types/Command'
import type { MacroFunction } from '@/core/types/Marco'

export const setAudio: MacroFunction<SetAudioCommandArgs & { duration?: number }> = (args) => {
    const array = Array<CommandEntitys>()
    if (args.type === 'BGM') {
        args.loop = true
        array.push({ key: 'unlock', args: { file: args.file } })
    }
    if (args.file !== undefined) args.file = `./static/AudioClip/${args.file}.flac`
    if (args.name === undefined) args.name = args.type
    if (args.duration) {
        array.push({ key: 'tweenA', block: true, args: { target: args.name, volume: 0, duration: args.duration } })
        array.push({ key: 'closeA', args: { target: args.name } })
        array.push({ key: 'setA', args: Object.assign({ volume: 0 }, args) })
        array.push({ key: 'tweenA', args: { target: args.name, volume: args.volume || 1, duration: args.duration } })
    } else {
        array.push({ key: 'closeA', args: { target: args.name } })
        array.push({ key: 'setA', args: Object.assign({ volume: args.volume || 1 }, args) })
    }

    return [{ key: 'fork', args: array }]
}

export const closeAudio: MacroFunction<{ target?: string; duration?: number }> = (args) => {
    const array = Array<CommandEntitys>()
    if (args.target !== undefined) {
        array.push({
            key: 'tweenA',
            args: { volume: 0, target: args.target, duration: args.duration }
        })
        array.push({ key: 'closeA', args })
    } else {
        array.push({ key: 'closeA', args })
    }
    return array
}
