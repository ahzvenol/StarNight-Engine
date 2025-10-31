import type { Except } from 'type-fest'
import type { ImageCloseCommandArgs, ImageSetCommandArgs } from '../base/image'
import { DynamicMacro, NonBlockingMacro } from '@starnight/core'
import { Image } from '../base'
import { Dissolve } from '../base/image/transition'

const dissolve = Dissolve(0.225)

export type ImageSpriteCommandArgs = ImageSetCommandArgs & { src: string }

export const sprite = NonBlockingMacro<ImageSpriteCommandArgs>(
    () =>
        function* ({ transition = dissolve, ...args }) {
            yield Image.set({ transition, ...args })
        }
)

export type ImageBGCommandArgs = Except<ImageSetCommandArgs, 'z' | 'target'> & { src: string }

export const bg = NonBlockingMacro<ImageBGCommandArgs>(
    () =>
        function* ({ transition, ...args }) {
            yield Image.set({ transition, ...args, z: -Infinity, target: 1 })
        }
)

export const close = DynamicMacro<ImageCloseCommandArgs>(
    () =>
        function* ({ transition = dissolve, ...args }) {
            yield Image.close({ transition, ...args })
        }
)

export const tween = Image.tween

export const filters = Image.filters
