import type { Except } from 'type-fest'
import type { ImageSetCommandArgs } from '../commands/image'
import { Macro } from '@starnight/core'
import { Image, Var } from '../commands'

export const sprite = Macro<ImageSetCommandArgs & Except<PixiPlugin.Vars, 'zIndex'>>(
    () =>
        async function* (args) {
            args.src = `./static/ImageAsset/${args.src}.webp`
            yield Image.sprite(args)
        }
)

export const bg = Macro<ImageSetCommandArgs & { duration?: number } & Except<PixiPlugin.Vars, 'zIndex'>>(
    () =>
        async function* (args) {
            const raw = args.src
            const scale =
                raw.includes('bg_white') || raw.includes('bg_black') || raw.includes('bg_red')
                    ? { scaleX: 2, scaleY: 2 }
                    : raw.includes('large') || raw.includes('evcg')
                      ? { scaleX: 1, scaleY: 1 }
                      : { scaleX: 1.021, scaleY: 1.021 }
            args.src = `./static/ImageAsset/${args.src}.webp`
            yield Image.bg({ ...args, ...scale })
            yield Var.unlock(raw)
        }
)
