import type { Except } from 'type-fest'
import { DynamicMacro, NonBlockingMacro } from '@starnight/core'
import * as Base from './base'
import * as Live2D from './live2d'
import { Dissolve } from './transition'

const dissolve = Dissolve(0.225)

export type ImageSpriteCommandArgs = Base.ImageSetCommandArgs & { target: string, src: string }

export const sprite = NonBlockingMacro<ImageSpriteCommandArgs>(
    () =>
        function* ({ transition = dissolve, ...args }) {
            args.src = `./static${args.src}`
            yield Base.set({ transition, ...args })
        }
)

export type ImageBGCommandArgs = Except<Base.ImageSetCommandArgs, 'z' | 'target'> & { src: string }

export const bg = NonBlockingMacro<ImageBGCommandArgs>(
    () =>
        function* ({ transition, ...args }) {
            args.src = `./static${args.src}`
            yield Base.set({ transition, ...args, z: -Infinity, target: 1 })
        }
)

export const l2d = Live2D.composite

export const close = DynamicMacro<Base.ImageCloseCommandArgs>(
    () =>
        function* ({ transition = dissolve, ...args }) {
            yield Base.close({ transition, ...args })
        }
)

export const tween = Base.tween

export const filters = Base.filters
