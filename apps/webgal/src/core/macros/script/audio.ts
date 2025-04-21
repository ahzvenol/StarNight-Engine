import type { CommandEntities, MacroFunction } from 'starnight'
import type { SetAudioCommandArgs } from '@/core/commands/script/audio'

export const audio: MacroFunction<SetAudioCommandArgs & { duration?: number }> = (args) => {
    const array = Array<CommandEntities>()
    if (args.type === 'BGM') {
        args.loop = true
        array.push({ key: 'unlock', args: { file: args.file } })
    }
    if (args.file !== undefined) args.file = `./static/AudioClip/${args.file}.flac`
    if (args.name === undefined) args.name = args.type
    if (args.duration) {
        array.push({ key: 'fadeaudio', await: true, args: { target: args.name, volume: 0, duration: args.duration } })
        array.push({ key: 'closeaudio', args: { target: args.name } })
        array.push({ key: 'setaudio', args: Object.assign({ volume: 0 }, args) })
        array.push({ key: 'fadeaudio', args: { target: args.name, volume: args.volume || 1, duration: args.duration } })
    } else {
        array.push({ key: 'closeaudio', args: { target: args.name } })
        array.push({ key: 'setaudio', args: Object.assign({ volume: args.volume || 1 }, args) })
    }

    return [{ key: 'fork', args: array }]
}

export const closeaudio: MacroFunction<{ target?: string; duration?: number }> = (args) => {
    const array = Array<CommandEntities>()
    if (args.target !== undefined) {
        array.push({
            key: 'fadeaudio',
            args: { volume: 0, target: args.target, duration: args.duration }
        })
        array.push({ key: 'closeaudio', args })
    } else {
        array.push({ key: 'closeaudio', args })
    }
    return array
}
