import { Dynamic, StarNight } from '@starnight/core'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { omit } from 'es-toolkit'

gsap.registerPlugin(CustomEase)
gsap.defaults({ ease: 'none', duration: 0 })

declare module '@starnight/core' {
    interface GameTempData {
        activetimelines: Map<gsap.TweenTarget, gsap.core.Timeline>
    }
}

type TweenVars = Record<string, number | string> & Record<number, Record<string, number | string>>
type GSAPEaseArg = gsap.EaseString | gsap.EaseFunction
type GSAPSpecialProps = { ease?: GSAPEaseArg, repeat?: number, yoyo?: boolean, position?: string, label?: string }
type TweenSpecialProps = { duration?: number } & GSAPSpecialProps
type TimelineSpecialProps = { transform: Array<TweenBlock> } & GSAPSpecialProps
type TweenBlock = (TweenSpecialProps | TweenVars) | TimelineSpecialProps

const isTimelineProps = (block: TweenBlock): block is TimelineSpecialProps => 'transform' in block

function buildTimeline(target: gsap.TweenTarget, props: TimelineSpecialProps): gsap.core.Timeline {
    props = omit(props, ['position'])
    const timeline = gsap.timeline({ ...props, paused: true })
    for (const block of props.transform) {
        if (isTimelineProps(block)) {
            const { position, ...props } = block
            timeline.add(buildTimeline(target, props), position)
        } else {
            const { position, ...props } = block
            timeline.to(target, props, position)
        }
    }

    return timeline
}

export type TransformArgType = TweenSpecialProps | Array<TweenBlock>

function buildTransform(target: gsap.TweenTarget, transform: TransformArgType): gsap.core.Timeline {
    if (Array.isArray(transform)) return buildTimeline(target, { transform: transform })
    else return buildTimeline(target, { transform: [transform] })
}

StarNight.GameEvents.setup.subscribe(({ temp }) => {
    temp.activetimelines = new Map()
})

StarNight.ActEvents.start.subscribe(({ state, temp: { activetimelines } }) => {
    if (!state.isInitializing()) {
        for (const timeline of activetimelines.values()) {
            if (timeline.progress() !== 1) timeline.progress(1)
        }
        activetimelines.clear()
    }
})

export type TweenCommandArgs = { target: gsap.TweenTarget, transform: TransformArgType }

export const apply = Dynamic<TweenCommandArgs>(
    ({ state, temp: { activetimelines } }) =>
        function* ({ target, transform }) {
            const subTimeline = buildTransform(target, transform)
            if (state.isInitializing()) {
                subTimeline.seek(subTimeline.duration())
            } else {
                const timeline = activetimelines.get(target)
                    ?? activetimelines.set(target, gsap.timeline()).get(target)!
                timeline.add(subTimeline, (transform as { position?: string }).position)
                yield new Promise((res) => subTimeline.once('complete', res))
                const isLastAnimation = subTimeline.endTime() === timeline.duration()
                const isInfiniteAnimation = timeline.getChildren().some((a) => a.repeat() === -1)
                if (isLastAnimation && !isInfiniteAnimation) timeline.progress(1)
            }
        }
)
