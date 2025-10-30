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

type PixiVars = {
    x?: number | string, y?: number | string, width?: number | string, height?: number | string, alpha?: number | string,
    pivot?: number, pivotX?: number | string, pivotY?: number | string, angle?: number | string,
    scale?: number | string, scaleX?: number | string, scaleY?: number | string,
    skew?: number | string, skewX?: number | string, skewY?: number | string,
    brightness?: number, contrast?: number, saturation?: number, hue?: number,
    blur?: number, blurX?: number, blurY?: number, blurPadding?: number, colorize?: string | number, colorizeAmount?: number
}

type TweenVars = Record<string, number | string> & Record<number, Record<string, number | string>>
type GsapEaseArg = gsap.EaseString | gsap.EaseFunction
type GsapSpecialProps = { ease?: GsapEaseArg, repeat?: number, yoyo?: boolean, position?: string, label?: string }
type TweenSpecialProps = { duration?: number } & GsapSpecialProps
type TimelineSpecialProps = { transform: Array<TweenBlock> } & GsapSpecialProps
type TweenBlock = (TweenSpecialProps | (TweenVars & PixiVars)) | TimelineSpecialProps

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
            if (state.isInitializing()) subTimeline.progress(1)
            else {
                // 对同一个目标的动画添加到同一个timeline中,如果没有position参数,默认依次执行
                const timeline = activetimelines.get(target)
                    ?? activetimelines.set(target, gsap.timeline()).get(target)!
                timeline.add(subTimeline, (transform as { position?: string }).position)
                // 如果当前存在无限循环的动画,就不再计入时间统计,此类timeline将在下一幕开始时被完成
                const isInfinite = timeline.getChildren().some((a) => a.repeat() === -1)
                if (!isInfinite) {
                    yield new Promise((res) => subTimeline.once('complete', res))
                    if (subTimeline.endTime() === timeline.duration()) timeline.progress(1)
                }
            }
        }
)
