import type { AudioBGMCommandArgs, AudioClipCommandArgs, AudioSECommandArgs } from '../api/audio'
import { Macro } from '@starnight/core'
import { Audio, Var } from '../api'

export const bgm = Macro<AudioBGMCommandArgs>(
    () =>
        async function* (args) {
            yield Var.unlock(args.src)
            if (args.src !== undefined) args.src = `./static/AudioClip/${args.src}.flac`
            yield Audio.bgm(args)
        }
)

export const se = Macro<AudioSECommandArgs>(
    () =>
        async function* (args) {
            if (args.src !== undefined) args.src = `./static/AudioClip/${args.src}.flac`
            yield Audio.se(args)
        }
)

export const clip = Macro<AudioClipCommandArgs>(
    () =>
        async function* (args) {
            if (args.src !== undefined) args.src = `./static/AudioClip/${args.src}.flac`
            yield Audio.clip(args)
        }
)
