import type { Except } from 'type-fest'
import type { ImageCloseCommandArgs, ImageSetCommandArgs } from '../base/image'
import { DynamicMacro, NonBlockingMacro } from '@starnight/core'
import { Image } from '../base'

export const close = DynamicMacro<ImageCloseCommandArgs>(
    () =>
        function* ({ transition, ...args }) {
            yield Image.close({ transition, ...args })
        }
)

export const tween = Image.tween

export type ImageSpriteCommandArgs = ImageSetCommandArgs & { src: string }

export const sprite = NonBlockingMacro<ImageSpriteCommandArgs>(
    ({ current, local: { iclearpoint } }) =>
        function* ({ transition, ...args }) {
            if (iclearpoint && current.count() < iclearpoint) return
            yield Image.set({ transition, ...args })
        }
)

export type ImageBGCommandArgs = Except<ImageSetCommandArgs, 'z' | 'id'> & { src: string }

export const bg = NonBlockingMacro<ImageBGCommandArgs>(
    () =>
        function* ({ transition, ...args }) {
            yield Image.set({ transition, ...args, z: -Infinity, id: 1 })
        }
)
