import type { Except } from 'type-fest'
import { DynamicMacro, NonBlockingMacro } from '@starnight/core'
import * as Impl from './impl'
import { Dissolve } from './transition'

const dissolve = Dissolve(0.225)

export type ImageSpriteCommandArgs = Impl.ImageSetCommandArgs & { src: string }

export const sprite = NonBlockingMacro<ImageSpriteCommandArgs>(
    () =>
        function* ({ transition = dissolve, ...args }) {
            yield Impl.set({ transition, ...args })
        }
)

export type ImageBGCommandArgs = Except<Impl.ImageSetCommandArgs, 'z' | 'target'> & { src: string }

export const bg = NonBlockingMacro<ImageBGCommandArgs>(
    () =>
        function* ({ transition, ...args }) {
            yield Impl.set({ transition, ...args, z: -Infinity, target: 1 })
        }
)

export const close = DynamicMacro<Impl.ImageCloseCommandArgs>(
    () =>
        function* ({ transition = dissolve, ...args }) {
            yield Impl.close({ transition, ...args })
        }
)

export const tween = Impl.tween

export const filters = Impl.filters
