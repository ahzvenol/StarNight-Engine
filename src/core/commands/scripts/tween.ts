import { CommandRunFunction } from '@/core/Command'
import { omit } from 'es-toolkit'

const EASE_KEYS = [
    'linear',
    'none',
    'quadIn',
    'quadInOut',
    'quadOut',
    'quartIn',
    'quartInOut',
    'quartOut',
    'quintIn',
    'quintInOut',
    'quintOut',
    'sineIn',
    'sineInOut',
    'sineOut'
] as const

let activeTweens = new Map<Object, createjs.Tween>()

const onActStart = () => activeTweens.clear()

const tween: CommandRunFunction =
    ({ timer }) =>
    ({ target, duration, transition, ...args }) => {
        const ease = (
            (EASE_KEYS as unknown as Array<string>).includes(transition) ? transition : 'linear'
        ) as (typeof EASE_KEYS)[number]
        if (!(target in activeTweens)) activeTweens.set(target, createjs.Tween.get(target))
        const tween = activeTweens.get(target)!
        tween.to(
            omit(args, ['@']),
            duration,
            (createjs.Ease as { [key in (typeof EASE_KEYS)[number]]: Function })[ease]
        )
        timer.addTrackedPromise(new Promise<any>((res) => tween.addEventListener('complete', res)))
        timer.addFinalizeMethod(() => tween.setPosition(tween.duration))
    }

const Tween = { onActStart, init: tween, run: tween }
