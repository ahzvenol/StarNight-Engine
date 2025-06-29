import type { Except } from 'type-fest'
import type { ImageCloseCommandArgs, ImageSetCommandArgs, ImageTweenCommandArgs } from '../base/image'
import { Fork, NonBlocking, NonBlockingMacro } from '@starnight/core'
import { omit } from 'es-toolkit'
import { Image } from '../base'

export const close =
NonBlockingMacro<{ target: NonNullable<ImageCloseCommandArgs['target']> } & { duration?: ImageTweenCommandArgs['duration'] }>(
    () =>
        function* ({ duration = 225, target: _target }) {
            if (!duration) yield Image.close({ target: _target })
            else {
                const targets = Array.isArray(_target) ? _target : [_target]
                for (const target of targets) {
                    yield Fork(
                        async function* () {
                            yield Image.tween({ target, inherit: false, alpha: 0, duration })
                        }
                    )
                }
            }
        }
)

export const clean = NonBlocking((context) => () => Image.close({ exclude: 1 })(context))

export const animation = Image.animation

export const tween = Image.tween

export const filter = Image.filter

export type ImageSpriteCommandArgs = ImageSetCommandArgs & Except<ImageTweenCommandArgs, 'target' | 'ease' | 'inherit'>

export const sprite = NonBlockingMacro<ImageSpriteCommandArgs>(
    () =>
        function* ({ duration = 225, ...args }) {
            yield Image.tween({ target: args.id, inherit: false, alpha: 0, duration })
            yield Image.set({ id: args.id, src: args.src, z: args.z })
            yield Image.tween({ target: args.id, inherit: false, alpha: 0, duration: 0 })
            yield Image.tween({ target: args.id, inherit: false, alpha: 1, duration })
            yield Image.tween({ target: args.id, ...omit(args, ['src', 'id']), duration: 0 })
        }
)

export type ImageBGCommandArgs =
Except<ImageSetCommandArgs, 'z' | 'id'> & Except<ImageTweenCommandArgs, 'target' | 'ease' | 'inherit' | 'alpha'>

export const bg = NonBlockingMacro<ImageBGCommandArgs>(
    () =>
        function* ({ duration, ...args }) {
            yield Image.set({ ...args, z: -Infinity, id: 1 })
            yield Image.tween({ target: 1, inherit: false, ...omit(args, ['src']), duration: 0 })
            yield Image.tween({ target: 1, inherit: false, alpha: 0, duration: 0 })
            yield Image.tween({ target: 1, inherit: false, alpha: 1, duration })
        }
)
