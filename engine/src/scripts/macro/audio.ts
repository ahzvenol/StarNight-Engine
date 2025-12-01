import type { AudioBGMCommandArgs } from '../api/audio'
import { NonBlockingMacro } from '@starnight/core'
import { Audio, Var } from '../api'

export const bgm = NonBlockingMacro<AudioBGMCommandArgs>(
    () =>
        function* (args) {
            yield Var.unlock(args.src)
            yield yield Audio.bgm(args)
        }
)
