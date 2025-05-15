import type { AudioSetCommandArgs } from '../commands/audio'
import { Macro } from '@starnight/core'
import { Audio, Var } from '../commands'

export const set = Macro<AudioSetCommandArgs & { duration?: number }>(
    () =>
        async function* (args) {
            if (args.type === 'BGM') {
                args.loop = true
                yield Var.unlock(args.src)
            }
            if (args.src !== undefined) args.src = `./static/AudioClip/${args.src}.flac`
            if (args.id === undefined) args.id = args.type
            if (args.duration) {
                yield Audio.volume({ target: args.id, volume: 0, duration: args.duration })
                yield Audio.close({ target: args.id })
                yield Audio.set(Object.assign({ volume: 0 }, args))
                yield Audio.volume({ target: args.id, volume: args.volume || 1, duration: args.duration })
            } else {
                yield Audio.close({ target: args.id })
                yield Audio.set(Object.assign({ volume: args.volume || 1 }, args))
            }
        }
)
