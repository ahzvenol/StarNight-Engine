import type { TransitionFunction } from '.'
import { AlphaFilter, BLEND_MODES, Texture } from 'pixi.js'
import { ImageDissolveFilter } from './ImageDissolveFilter'

export const Dissolve: (duration: number) => TransitionFunction =
(duration) =>
    ({ before, after }) => {
        if (before) {
            const filter = new AlphaFilter(1)
            filter.blendMode = BLEND_MODES.ADD
            before.filters = [...before.filters || [], filter]
        }
        if (after) {
            const filter = new AlphaFilter(0)
            filter.blendMode = BLEND_MODES.ADD
            after.filters = [...after.filters || [], filter]
        }
        return {
            before: { duration, [-1]: { alpha: 0 }, position: 0 },
            after: { duration, [-1]: { alpha: 1 }, position: 0 }
        }
    }

export const Fade: (out_time: number, in_time?: number) => TransitionFunction =
(out_time, in_time) =>
    ({ before, after }) => {
        if (before) {
            const filter = new AlphaFilter(1)
            filter.blendMode = BLEND_MODES.ADD
            before.filters = [...before.filters || [], filter]
        }
        if (after) {
            const filter = new AlphaFilter(0)
            filter.blendMode = BLEND_MODES.ADD
            after.filters = [...after.filters || [], filter]
        }
        return {
            before: { duration: out_time, [-1]: { alpha: 0 }, position: 0 },
            after: { duration: in_time, [-1]: { alpha: 1 }, delay: out_time, position: 0 }
        }
    }

export const ImageDissolve: (arg0: { src: string, duration: number, ramplen?: number, reverse?: boolean }) => TransitionFunction =
({ src, duration, ramplen = 8, reverse = false }) =>
    ({ before, after }) => {
        const texture = Texture.from(src)
        if (before) {
            const filter = new ImageDissolveFilter(texture, { progress: 1, ramplen, reverse })
            filter.blendMode = BLEND_MODES.ADD
            before.filters = [...before.filters || [], filter]
        }
        if (after) {
            const filter = new ImageDissolveFilter(texture, { progress: 0, ramplen, reverse: !reverse })
            filter.blendMode = BLEND_MODES.ADD
            after.filters = [...after.filters || [], filter]
        }
        return {
            before: { duration, [-1]: { progress: 0 }, position: 0 },
            after: { duration, [-1]: { progress: 1 }, position: 0 }
        }
    }
