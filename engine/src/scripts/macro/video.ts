import type { VideoCommandArgs } from '../api/video'
import { BlockingMacro } from '@starnight/core'
import { Var, Video } from '../api'

export const use = BlockingMacro<VideoCommandArgs>(
    () =>
        function* (args) {
            yield Var.unlock(args.src)
            yield yield Video.use(args)
        }
)
