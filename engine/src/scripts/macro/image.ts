import type { ImageBGCommandArgs } from '../api/image'
import { NonBlockingMacro } from '@starnight/core'
import { Image, Var } from '../api'

export const bg = NonBlockingMacro<ImageBGCommandArgs>(
    () =>
        function* (args) {
            yield Var.unlock(args.src)
            yield yield Image.bg(args)
        }
)
