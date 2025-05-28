import type { Except } from 'type-fest'
import type { ImageSetCommandArgs, ImageTweenCommandArgs } from '../base/image'
import { DynamicMacro, NonBlockingMacro } from '@starnight/core'
import { mapValues, omit } from 'es-toolkit'
import { Image } from '../base'

export const set = Image.set

export const close = Image.close

export const shake = Image.shake

export const punch = Image.punch

export const tween = DynamicMacro<ImageTweenCommandArgs>(
    () =>
        function* ({ target, ease, duration, ...args }) {
            const offsetArgs = mapValues(args, (arg) => '+=' + arg)
            yield Image.tween({ target, ease, duration, ...offsetArgs })
        }
)

export const filter = Image.filter

export const filter_tween = Image.filter_tween

export type ImageSpriteCommandArgs = ImageSetCommandArgs & { duration?: number } & Except<PixiPlugin.Vars, 'zIndex'>

export const sprite = NonBlockingMacro<ImageSpriteCommandArgs>(
    () =>
        function* ({ duration = 175, ...args }) {
            yield Image.tween({ target: args.id, ease: 'power1.in', duration, alpha: 0, inherit: false })
            yield Image.set({ id: args.id, src: args.src, z: args.z })
            yield Image.tween({ target: args.id, inherit: true, ...args, duration: 0 })
        }
)

export type ImageBGCommandArgs = Except<ImageSetCommandArgs, 'z' | 'id'> &
    Except<PixiPlugin.Vars, 'zIndex'> & { duration?: number }

export const bg = NonBlockingMacro<ImageBGCommandArgs>(
    () =>
        function* (args) {
            yield Image.tween({ target: 'bg', ease: 'power1.in', duration: args.duration, alpha: 0, inherit: false })
            yield Image.set({ ...args, z: -Infinity, id: 'bg' })
            yield Image.tween({ target: 'bg', inherit: false, ...omit(args, ['src']), duration: 0 })
        }
)
