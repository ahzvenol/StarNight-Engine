import type { Except } from 'type-fest'
import type { ImageCloseCommandArgs, ImageSetCommandArgs, ImageTweenArgs, ImageTweenCommandArgs } from '../base/image'
import { NonBlockingMacro } from '@starnight/core'
import { omit } from 'es-toolkit'
import { Image } from '../base'

export const close = NonBlockingMacro<ImageCloseCommandArgs>(
    () =>
        function* ({ duration = 225, target }) {
            yield Image.close({ target, duration })
        }
)

export const clean = NonBlockingMacro<{ duration?: ImageTweenCommandArgs['duration'] } | void>(
    ({ current, local: { iclearpoint } }) =>
        function* ({ duration } = {}) {
            current.iclearpoint(current.count())
            if (iclearpoint && current.count() < iclearpoint) return
            yield Image.close({ exclude: 1, duration })
        }
)

export const animation = Image.animation

export const tween = Image.tween

export const filter = Image.filter

export type ImageSpriteCommandArgs = ImageSetCommandArgs & Except<ImageTweenArgs, 'alpha'> & { duration?: number }

export const sprite = NonBlockingMacro<ImageSpriteCommandArgs>(
    ({ current, local: { iclearpoint } }) =>
        function* ({ duration = 225, ...args }) {
            if (iclearpoint && current.count() < iclearpoint) return
            yield Image.tween({ target: args.id, inherit: false, alpha: 0, duration })
            yield Image.set({ id: args.id, src: args.src, z: args.z })
            yield Image.tween({ target: args.id, inherit: false, alpha: 0, duration: 0 })
            yield Image.tween({ target: args.id, inherit: false, alpha: 1, duration })
            yield Image.tween({ target: args.id, ...omit(args, ['src', 'id']), duration: 0 })
        }
)

export type ImageBGCommandArgs = Except<ImageSetCommandArgs, 'z' | 'id'> & Except<ImageTweenArgs, 'alpha'> & { duration: number }

export const bg = NonBlockingMacro<ImageBGCommandArgs>(
    () =>
        function* ({ duration, ...args }) {
            yield Image.set({ ...args, z: -Infinity, id: 1 })
            yield Image.tween({ target: 1, inherit: false, ...omit(args, ['src']), duration: 0 })
            yield Image.tween({ target: 1, inherit: false, alpha: 0, duration: 0 })
            yield Image.tween({ target: 1, inherit: false, alpha: 1, duration })
        }
)
