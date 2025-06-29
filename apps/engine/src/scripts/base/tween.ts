import type { Except } from 'type-fest'
import { Dynamic, StarNight } from '@starnight/core'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { isUndefined } from 'es-toolkit'

gsap.registerPlugin(CustomEase)
gsap.defaults({ ease: 'none', duration: 0 })

declare module '@starnight/core' {
    interface GameTempData {
        activetimelines: Map<gsap.TweenTarget, gsap.core.Timeline>
    }
}

StarNight.GameEvents.setup.subscribe(({ temp }) => {
    temp.activetimelines = new Map()
})

StarNight.ActEvents.start.subscribe(({ state, temp: { activetimelines } }) => {
    if (!state.isInitializing()) {
        activetimelines.clear()
    }
})

export type TweenCommandArgs = {
    target: gsap.TweenTarget
    id?: gsap.TweenTarget
    mode?: 'from' | 'to'
    ease?: gsap.EaseString | gsap.EaseFunction
    duration?: number
    position?: gsap.Position
} & Except<gsap.TweenVars, 'id'>

export const apply = Dynamic<TweenCommandArgs>(
    ({ state, temp: { activetimelines } }) =>
        function* ({ target, id = target, mode = 'to', ease = 'none', position, ...args }) {
            if (state.isInitializing()) {
                if (mode === 'to') gsap.set(target, args)
            } else {
                // 保证对同一个id的动画被顺序应用
                if (!activetimelines.has(id)) {
                    const timeline = gsap.timeline({ paused: false })
                    activetimelines.set(id, timeline)
                }
                const timeline = activetimelines.get(id)!
                if (!isUndefined(args.duration)) args.duration = args.duration / 1000
                const promise = new Promise<void>((res) =>
                    timeline[mode](target, {
                        ...args,
                        ease: gsap.parseEase(ease),
                        onComplete: res
                    }, position)
                )
                const current = timeline.duration()
                yield promise
                if (current === timeline.duration()) timeline.seek(timeline.duration())
            }
        }
)
