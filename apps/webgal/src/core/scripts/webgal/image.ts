import type { ImageBGCommandArgs, ImageSpriteCommandArgs } from '../api/image'
import { NonBlockingMacro } from '@starnight/core'
import { Image, Var } from '../api'

export const sprite = NonBlockingMacro<ImageSpriteCommandArgs>(
    () =>
        async function* (args) {
            args.src = `./static/ImageAsset/${args.src}`
            yield Image.sprite(args)
        }
)

export const bg = NonBlockingMacro<ImageBGCommandArgs>(
    () =>
        async function* (args) {
            yield Var.unlock(args.src)
            args.src = `./static/ImageAsset/${args.src}`
            yield Image.bg(args)
        }
)
