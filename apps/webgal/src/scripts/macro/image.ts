import type { ImageBGCommandArgs, ImageSpriteCommandArgs } from '../api/image'
import type { ImageTweenCommandArgs } from '../base/image'
import { NonBlockingMacro } from '@starnight/core'
import { mapValues } from 'es-toolkit'
import { Image, Var } from '../api'

export const sprite = NonBlockingMacro<ImageSpriteCommandArgs>(
    () =>
        function* (args) {
            args.src = `./static${args.src}`
            yield Image.sprite(args)
        }
)

export const bg = NonBlockingMacro<ImageBGCommandArgs>(
    () =>
        function* (args) {
            yield Var.unlock(args.src)
            args.src = `./static${args.src}`
            yield Image.bg(args)
        }
)

export const tween = NonBlockingMacro<ImageTweenCommandArgs>(
    () =>
        function* ({ target, ease, duration, ...args }) {
            yield Image.tween({ target, ease, duration, ...mapValues(args, (arg) => '+=' + arg) })
        }
)
