import type { VideoCommandArgs } from '../base/video'
import { BlockingMacro } from '@starnight/core'
import { Video } from '../api'

export const use = BlockingMacro<VideoCommandArgs>(
    (context) =>
        async function* ({ src }) {
            await Video.use({ src: `./static/${src}` })(context)
        }
)
