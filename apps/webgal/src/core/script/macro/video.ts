import type { VideoCommandArgs } from '@/script/command/video'
import { Macro } from '@starnight/core'
import { Video } from '..'

export const use = Macro<VideoCommandArgs>(
    () =>
        async function* (arg0) {
            yield Video.use(`./static/${arg0}.mp4`)
        }
)
