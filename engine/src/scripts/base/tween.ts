import type { MergeExclusive } from 'type-fest'
import { Dynamic, DynamicMacro, StarNight } from '@starnight/core'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { omit } from 'es-toolkit'
import { Container } from 'pixi.js'

gsap.registerPlugin(CustomEase)
gsap.defaults({ ease: 'none', overwrite: 'auto', duration: 0 })

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
const PixiKeySet = new Set([
    'x', 'y', 'width', 'height', 'alpha',
    'pivot', 'pivotX', 'pivotY', 'angle',
    'scale', 'scaleX', 'scaleY',
    'skew', 'skewX', 'skewY',
    'brightness', 'contrast', 'saturation', 'hue',
    'blur', 'blurX', 'blurY', 'blurPadding',
    'colorize', 'colorizeAmount'
])
type TweenVars = Record<string, number | string>
type FiltersVars = Record<number, Record<string, number | string>>
type GsapEaseArg = gsap.EaseString | gsap.EaseFunction
type GsapSpecialProps = { ease?: GsapEaseArg, repeat?: number, yoyo?: boolean, position?: number | string }
type TweenSpecialProps = { duration?: number, delay?: number, label?: string } & GsapSpecialProps
type TimelineSpecialProps = { defaults?: TweenSpecialProps | TweenVars, transform: Array<TweenBlock> } & GsapSpecialProps
type TweenBlock = MergeExclusive<(TweenSpecialProps | (TweenVars & PixiVars & FiltersVars)), TimelineSpecialProps>

const isTimelineProps = (block: TweenBlock): block is TimelineSpecialProps => 'transform' in block

function buildTimeline(target: gsap.TweenTarget, _props: TweenBlock): gsap.core.Tween | gsap.core.Timeline {
    const props = omit(_props, ['position']) as TweenBlock
    if (isTimelineProps(props)) {
        const timeline = gsap.timeline({ ...props, paused: true })
        for (const { position, ...transform } of props.transform) {
            timeline.add(buildTimeline(target, transform), position)
        }
        return timeline
    } else {
        if (target instanceof Container) {
            const [defaults, pixi, filters] = [{}, {}, {}] as Array<Record<string, unknown>>
            for (const key in props) {
                const value = props[key as keyof typeof props]
                if (PixiKeySet.has(key)) pixi[key] = value
                else if (/^-?\d+$/.test(key)) filters[key] = value
                else defaults[key] = value
            }
            const timeline = gsap.timeline({ defaults, paused: true })
            if (Object.keys(pixi).length !== 0) {
                timeline.to(target, { pixi }, 0)
            }
            if (Object.keys(filters).length !== 0) {
                for (const [key, props] of Object.entries(filters)) {
                    const filter = target.filters?.at(Number(key))
                    if (filter) timeline.to(filter, props as object, 0)
                }
            }
            return timeline
        } else return gsap.to(target, { ...props, paused: true })
    }
}

export type TransformBlock = TweenSpecialProps | TimelineSpecialProps | Array<TweenBlock>

StarNight.GameEvents.setup.subscribe(({ temp }) => {
    temp.activetimelines = new Map()
})

StarNight.ActEvents.start.subscribe(({ state, temp: { activetimelines } }) => {
    if (!state.isInitializing()) {
        for (const timeline of activetimelines.values()) {
            if (timeline.progress() !== 1) timeline.progress(1)
        }
    }
})
StarNight.ActEvents.start.subscribe(({ temp: { activetimelines } }) => activetimelines.clear())

const _apply = Dynamic<{ target: gsap.TweenTarget, transform: TweenBlock }>(
    ({ state, temp: { activetimelines } }) =>
        function* ({ target, transform }) {
            const subTimeline = buildTimeline(target, transform)
            // 对同一个目标的动画添加到同一个timeline中,如果没有position参数,默认依次执行
            const timeline = activetimelines.get(target)
                ?? activetimelines.set(target, gsap.timeline()).get(target)!
            // 为了position参数工作正常,始终需要维护map并将subTimeline添加到根timeline
            timeline.add(subTimeline, (transform.position))
            // 如果当前存在无限循环的动画,就不再计入时间统计,此类timeline将在下一幕开始时被完成
            const isInfinite = timeline.getChildren().some((a) => a.repeat() === -1)
            if (state.isInitializing()) subTimeline.progress(1)
            else if (!isInfinite && subTimeline.endTime() > timeline.time()) {
                yield new Promise((res) => subTimeline.eventCallback('onComplete', res))
                // 这行代码用于快进时设置最终状态,如果动画正常运行完毕,则不产生任何效果
                if (subTimeline.endTime() === timeline.duration()) timeline.progress(1)
            }
        }
)

export type TweenCommandArgs = { target: gsap.TweenTarget, transform: TransformBlock }

export const apply = DynamicMacro<TweenCommandArgs>(
    () =>
        function* ({ target, transform }) {
            if (Array.isArray(transform)) {
                for (const _transform of transform) {
                    yield _apply({ target, transform: _transform })
                }
            } else yield _apply({ target, transform })
        }
)
