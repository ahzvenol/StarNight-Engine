import type { VideoCommandArgs } from '../commands/video'
import { Macro } from '@starnight/core'
import { Video } from '../commands'

export const use = Macro<VideoCommandArgs>(
    () =>
        async function* ({ src }) {
            yield Video.use({ src: `./static/${src}.mp4` })
        }
)
