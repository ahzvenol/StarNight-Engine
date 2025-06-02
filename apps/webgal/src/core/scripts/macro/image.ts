import type { ImageBGCommandArgs, ImageSpriteCommandArgs } from '../api/image'
import { NonBlockingMacro } from '@starnight/core'
import { Image, Var } from '../api'
import type { ImageTweenCommandArgs } from '../base/image'
import { mapValues } from 'es-toolkit'

// export const sprite = NonBlockingMacro<ImageSpriteCommandArgs>(
//     () =>
//         function* (args) {
//             args.src = `./static${args.src}`
//             yield Image.sprite(args)
//         }
// )

// export const bg = NonBlockingMacro<ImageBGCommandArgs>(
//     () =>
//         function* (args) {
//             yield Var.unlock(args.src)
//             args.src = `./static${args.src}`
//             yield Image.bg(args)
//         }
// )

export const tween = NonBlockingMacro<ImageTweenCommandArgs>(
    () =>
        function* ({ target, ease, duration, ...args }) {
            yield Image.tween({ target, ease, duration, ...mapValues(args, (arg) => '+=' + arg) })
        }
)

export const sprite = NonBlockingMacro<ImageSpriteCommandArgs>(
    () =>
        function* (args) {
            args.src = `./static/ImageAsset/${args.src}.webp`
            yield Image.sprite(args)
        }
)

export const bg = NonBlockingMacro<ImageBGCommandArgs>(
    () =>
        function* (args) {
            yield Var.unlock(args.src)
            args.src = `./static/ImageAsset/${args.src}.webp`
            yield Image.bg(args)
        }
)
