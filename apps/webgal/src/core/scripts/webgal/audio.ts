import type { AudioBGMCommandArgs, AudioClipCommandArgs, AudioSECommandArgs } from '../api/audio'
import { Macro } from '@starnight/core'
import { Audio, Var } from '../api'

export const bgm = Macro<AudioBGMCommandArgs>(
    () =>
        async function* (args) {
            yield Var.unlock(args.src)
            args.src = `./static/AudioClip/${args.src}`
            yield Audio.bgm(args)
        }
)

export const se = Macro<AudioSECommandArgs>(
    () =>
        async function* (args) {
            args.src = `./static/AudioClip/${args.src}`
            yield Audio.se(args)
        }
)

export const clip = Macro<AudioClipCommandArgs>(
    () =>
        async function* (args) {
            args.src = `./static/AudioClip/${args.src}`
            yield Audio.clip(args)
        }
)
