import type { ImageBGCommandArgs, ImageSpriteCommandArgs } from '../api/image'
import { Macro } from '@starnight/core'
import { Image, Var } from '../api'

export const sprite = Macro<ImageSpriteCommandArgs>(
    () =>
        async function* (args) {
            args.src = `./static/ImageAsset/${args.src}`
            yield Image.sprite(args)
        }
)

export const bg = Macro<ImageBGCommandArgs>(
    () =>
        async function* (args) {
            yield Var.unlock(args.src)
            args.src = `./static/ImageAsset/${args.src}`
            yield Image.bg(args)
        }
)
