import type { ImageTargetSprite } from './impl'
import { NonBlocking } from '@starnight/core'
import { LazyLive2DModel } from './utils/LazyLive2DModel'

// model.model!.scale.set(Math.min(app.screen.width / model.width, app.screen.height / model.height))

export type Live2DMotionCommandArgs = { target: ImageTargetSprite, motion: string }

export const motion = NonBlocking<Live2DMotionCommandArgs>(
    ({ current, local: { iclearpoint }, temp: { stage } }) =>
        ({ target: _target, motion }) => {
            if (iclearpoint && current.count() < iclearpoint) return
            const target = stage.map.get(_target)?.getChildAt(-1)?.internal
            if (target instanceof LazyLive2DModel) target.motion(motion, 0, 3)
        }
)

export type Live2DExpressionCommandArgs = { target: ImageTargetSprite, expression: string }

export const expression = NonBlocking<Live2DExpressionCommandArgs>(
    ({ current, local: { iclearpoint }, temp: { stage } }) =>
        ({ target: _target, expression }) => {
            if (iclearpoint && current.count() < iclearpoint) return
            const target = stage.map.get(_target)?.getChildAt(-1)?.internal
            if (target instanceof LazyLive2DModel) target.expression(expression)
        }
)

export type Live2FocusCommandArgs = { target: ImageTargetSprite, x: number, y: number, instant?: boolean }

export const focus = NonBlocking<Live2FocusCommandArgs>(
    ({ current, local: { iclearpoint }, temp: { stage } }) =>
        ({ target: _target, x, y, instant }) => {
            if (iclearpoint && current.count() < iclearpoint) return
            const target = stage.map.get(_target)?.getChildAt(-1)?.internal
            if (target instanceof LazyLive2DModel) target.focus(x, y, instant)
        }
)

export type Live2BlinkCommandArgs =
{ target: ImageTargetSprite, interval?: number, random?: number, closing?: number, opening?: number, closed?: number }

export const blink = NonBlocking<Live2BlinkCommandArgs>(
    ({ current, local: { iclearpoint }, temp: { stage } }) =>
        ({
            target: _target, interval: blinkInterval, random: blinkIntervalRandom,
            closing: closingDuration, closed: closedDuration, opening: openingDuration
        }) => {
            if (iclearpoint && current.count() < iclearpoint) return
            const target = stage.map.get(_target)?.getChildAt(-1)?.internal
            if (target instanceof LazyLive2DModel) {
                target.blink({ blinkInterval, blinkIntervalRandom, closingDuration, closedDuration, openingDuration })
            }
        }
)
