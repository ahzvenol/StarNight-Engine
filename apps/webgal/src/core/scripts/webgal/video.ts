import type { VideoCommandArgs } from '../base/video'
import { Macro } from '@starnight/core'
import { Video } from '../api'

export const use = Macro<VideoCommandArgs>(
    () =>
        async function* ({ src }) {
            yield Video.use({ src: `./static/${src}.mp4` })
        }
)
