import { Dynamic, StarNight } from '@starnight/core'
import { isNil } from 'es-toolkit'

declare module '@starnight/core' {
    interface GameTempData {
        activetimelines: Map<gsap.TweenTarget, gsap.core.Timeline>
    }
}

StarNight.GameEvents.setup.subscribe(({ temp }) => {
    temp.activetimelines = new Map()
})

StarNight.ActEvents.start.subscribe(({ temp: { activetimelines } }) => {
    activetimelines.clear()
})

export type ImageToCommandArgs = {
    target?: gsap.TweenTarget
    ease?: string
    duration?: number
} & gsap.TweenVars

export const apply = Dynamic<ImageToCommandArgs>(
    ({ state, temp: { activetimelines } }) =>
        function* ({ target, ease = 'none', duration = 0, ...args }) {
            if (isNil(target)) return
            if (state.isInitializing()) {
                gsap.set(target, args)
            } else {
                // 保证对同一个物体的缓动被顺序应用
                if (!activetimelines.has(target)) {
                    const timeline = gsap.timeline({ paused: false })
                    activetimelines.set(target, timeline)
                }
                const timeline = activetimelines.get(target)!
                const promise = new Promise<void>((res) =>
                    timeline.to(target, {
                        ...args,
                        ease: gsap.parseEase(ease),
                        duration: duration / 1000,
                        onComplete: res
                    })
                )
                const current = timeline.duration()
                yield promise
                if (current === timeline.duration()) timeline.seek(timeline.duration())
            }
        }
)
