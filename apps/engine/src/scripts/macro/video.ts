import type { VideoCommandArgs } from '../base/video'
import { BlockingMacro } from '@starnight/core'
import { Var, Video } from '../api'

export const use = BlockingMacro<VideoCommandArgs>(
    () =>
        function* ({ src }) {
            yield Var.unlock(src)
            yield (yield Video.use({ src: `./static${src}` }))
        }
)
