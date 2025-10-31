import type { TransitionFunction } from '.'
import { AlphaFilter, BLEND_MODES, Texture } from 'pixi.js'
import { ImageDissolveFilter } from './ImageDissolveFilter'

export const Dissolve: (duration: number) => TransitionFunction =
(duration) =>
    ({ before, after }) => {
        if (before) before.filters = [Object.assign(new AlphaFilter(1), { blendMode: BLEND_MODES.ADD })]
        if (after) after.filters = [Object.assign(new AlphaFilter(0), { blendMode: BLEND_MODES.ADD })]
        return { before: { duration, [1]: { alpha: 0 } }, after: { duration, [1]: { alpha: 1 } } }
    }

export const Fade: (out_time: number, in_time?: number) => TransitionFunction =
(out_time, in_time) =>
    ({ before, after }) => {
        if (before) before.filters = [Object.assign(new AlphaFilter(1), { blendMode: BLEND_MODES.ADD })]
        if (after) after.filters = [Object.assign(new AlphaFilter(0), { blendMode: BLEND_MODES.ADD })]
        return { before: { duration: out_time, [1]: { alpha: 0 } }, after: { duration: in_time, [1]: { alpha: 1 }, delay: out_time } }
    }

export const ImageDissolve: (arg0: { src: string, duration: number, ramplen?: number, reverse?: boolean }) => TransitionFunction =
({ src, duration, ramplen = 8, reverse = false }) =>
    ({ before, after }) => {
        const rule = Texture.from(src)
        if (before) before.filters = [
            Object.assign(new ImageDissolveFilter(rule, { progress: 1, ramplen, reverse }), { blendMode: BLEND_MODES.ADD })
        ]
        if (after) after.filters = [
            Object.assign(new ImageDissolveFilter(rule, { progress: 0, ramplen, reverse: !reverse }), { blendMode: BLEND_MODES.ADD })
        ]
        return { before: { duration, [1]: { progress: 0 } }, after: { duration, [1]: { progress: 1 } } }
    }
