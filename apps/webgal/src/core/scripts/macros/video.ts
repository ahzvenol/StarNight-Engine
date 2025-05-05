import type { VideoCommandArgs } from '../commands/video'
import { Macro } from '@starnight/core'
import { Video } from '../commands'

export const use = Macro<VideoCommandArgs>(
    () =>
        async function* (arg0) {
            yield Video.use(`./static/${arg0}.mp4`)
        }
)
