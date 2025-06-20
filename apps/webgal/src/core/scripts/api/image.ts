import type { Except } from 'type-fest'
import type { ImageSetCommandArgs, ImageTweenCommandArgs } from '../base/image'
import { NonBlocking, NonBlockingMacro } from '@starnight/core'
import { omit } from 'es-toolkit'
import { Image } from '../base'

export const close = Image.close

export const clean = NonBlocking((context) => () => Image.close({ exclude: 'bg' })(context))

export const animation_effect = Image.animation_effect

export const tween = Image.tween

export const filter = Image.filter

export type ImageSpriteCommandArgs = ImageSetCommandArgs & Except<ImageTweenCommandArgs, 'target' | 'ease' | 'inherit'>

export const sprite = NonBlockingMacro<ImageSpriteCommandArgs>(
    () =>
        function* ({ duration = 175, ...args }) {
            yield Image.tween({ target: args.id, ease: 'power1.in', duration, alpha: 0, inherit: false })
            yield Image.set({ id: args.id, src: args.src, z: args.z })
            yield Image.tween({ target: args.id, inherit: true, ...omit(args, ['src']), duration: 0 })
        }
)

export type ImageBGCommandArgs = Except<ImageSetCommandArgs, 'z' | 'id'> & Except<ImageTweenCommandArgs, 'target' | 'ease' | 'inherit'>

export const bg = NonBlockingMacro<ImageBGCommandArgs>(
    () =>
        function* ({ duration, ...args }) {
            yield Image.tween({ target: 'bg', ease: 'power1.in', duration: duration, alpha: 0, inherit: false })
            yield Image.set({ ...args, z: -Infinity, id: 'bg' })
            yield Image.tween({ target: 'bg', inherit: false, ...omit(args, ['src']), duration: 0 })
        }
)
