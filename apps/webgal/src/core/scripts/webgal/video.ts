import type { VideoCommandArgs } from '../base/video'
import { BlockingMacro } from '@starnight/core'
import { Video } from '../api'

export const use = BlockingMacro<VideoCommandArgs>(
    () =>
        async function* ({ src }) {
            yield Video.use({ src: `./static/${src}` })
        }
)
