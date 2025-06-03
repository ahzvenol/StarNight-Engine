import type { AudioBGMCommandArgs, AudioClipCommandArgs, AudioSECommandArgs } from '../api/audio'
import { NonBlockingMacro } from '@starnight/core'
import { Audio, Var } from '../api'

export const bgm = NonBlockingMacro<AudioBGMCommandArgs>(
    () =>
        function* (args) {
            yield Var.unlock(args.src)
            args.src = `./static${args.src}`
            yield Audio.bgm(args)
        }
)

export const se = NonBlockingMacro<AudioSECommandArgs>(
    () =>
        function* (args) {
            args.src = `./static${args.src}`
            yield Audio.se(args)
        }
)

export const clip = NonBlockingMacro<AudioClipCommandArgs>(
    () =>
        function* (args) {
            args.src = `./static${args.src}`
            yield Audio.clip(args)
        }
)
