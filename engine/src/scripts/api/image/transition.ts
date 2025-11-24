import type { TransitionFunction } from './impl'
import { AlphaFilter, BLEND_MODES, Texture } from 'pixi.js'
import { ImageDissolveFilter } from './utils/ImageDissolveFilter'

export const Dissolve: (duration: number) => TransitionFunction =
(duration) =>
    ({ before, after }) => {
        if (before) before.filters = [Object.assign(new AlphaFilter(1), { blendMode: BLEND_MODES.ADD })]
        if (after) after.filters = [Object.assign(new AlphaFilter(0), { blendMode: BLEND_MODES.ADD })]
        return { before: { duration, [1]: { alpha: 0 } }, after: { duration, [1]: { alpha: 1 } } }
    }

export const Fade: (out_duration: number, in_duration?: number) => TransitionFunction =
(out_duration, in_duration) =>
    ({ before, after }) => {
        if (before) before.filters = [Object.assign(new AlphaFilter(1), { blendMode: BLEND_MODES.ADD })]
        if (after) after.filters = [Object.assign(new AlphaFilter(0), { blendMode: BLEND_MODES.ADD })]
        return {
            before: { duration: out_duration, [1]: { alpha: 0 } },
            after: { duration: in_duration, [1]: { alpha: 1 }, delay: out_duration }
        }
    }

export const ImageDissolve: (arg0: { src: string, duration: number, ramplen?: number, reverse?: boolean }) => TransitionFunction =
({ src, duration, ramplen = 8, reverse = false }) =>
    ({ before, after }) => {
        const rule = Texture.from(`./static${src}`)
        if (before) before.filters = [
            Object.assign(new ImageDissolveFilter(rule, { progress: 1, ramplen, reverse }), { blendMode: BLEND_MODES.ADD })
        ]
        if (after) after.filters = [
            Object.assign(new ImageDissolveFilter(rule, { progress: 0, ramplen, reverse: !reverse }), { blendMode: BLEND_MODES.ADD })
        ]
        return { before: { duration, [1]: { progress: 0 } }, after: { duration, [1]: { progress: 1 } } }
    }
