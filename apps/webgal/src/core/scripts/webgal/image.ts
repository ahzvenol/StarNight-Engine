import type { Except } from 'type-fest'
import type { ImageSetCommandArgs } from '../base/image'
import { Macro } from '@starnight/core'
import { Image, Var } from '../api'

export const sprite = Macro<ImageSetCommandArgs & Except<PixiPlugin.Vars, 'zIndex'>>(
    () =>
        async function* (args) {
            args.src = `./static/ImageAsset/${args.src}`
            yield Image.sprite(args)
        }
)

export const bg = Macro<ImageSetCommandArgs & { duration?: number } & Except<PixiPlugin.Vars, 'zIndex'>>(
    () =>
        async function* (args) {
            yield Var.unlock(args.src)
            args.src = `./static/ImageAsset/${args.src}`
            yield Image.bg(args)
        }
)
