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
        async function* ({ target, ease, duration, ...args }) {
            const offsetArgs = mapValues(args, (arg) => '+=' + arg)
            yield Image.tween({ target, ease, duration, ...offsetArgs })
        }
)

export const filter = Image.filter

export const filter_tween = Image.filter_tween

export type ImageSpriteCommandArgs = ImageSetCommandArgs & { duration?: number } & Except<PixiPlugin.Vars, 'zIndex'>

export const sprite = NonBlockingMacro<ImageSpriteCommandArgs>(
    (context) =>
        async function* ({ duration = 175, ...args }) {
            const time = Image.tween({
                target: args.id,
                ease: 'power1.in',
                duration,
                alpha: 0,
                inherit: false
            })(context)
            Image.set({ id: args.id, src: args.src, z: args.z })(context)
            yield Image.tween({ target: args.id, inherit: true, ...args, duration: 0 })
            await time
        }
)

export type ImageBGCommandArgs = Except<ImageSetCommandArgs, 'z' | 'id'> &
    Except<PixiPlugin.Vars, 'zIndex'> & { duration?: number }

export const bg = NonBlockingMacro<ImageBGCommandArgs>(
    (context) =>
        async function* (args) {
            const time = Image.tween({
                target: 'bg',
                ease: 'power1.in',
                duration: args.duration,
                alpha: 0,
                inherit: false
            })(context)
            Image.set({ ...args, z: -Infinity, id: 'bg' })(context)
            yield Image.tween({ target: 'bg', inherit: false, ...omit(args, ['src']), duration: 0 })
            await time
        }
)
