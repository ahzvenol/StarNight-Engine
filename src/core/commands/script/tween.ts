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
]

type TweenCommandArgs = { target: string; duration: number; transition: string }

const activeTweens = new Map<unknown, createjs.Tween>()

const onActStart = () => activeTweens.clear()

const tween: CommandRunFunction<TweenCommandArgs & Exclude<Record<string, unknown>, TweenCommandArgs>> =
    ({ timer }) =>
    ({ target, duration, transition, ...args }) => {
        const ease = EASE_KEYS.includes(transition) ? transition : 'linear'
        if (!(target in activeTweens)) activeTweens.set(target, createjs.Tween.get(target))
        const tween = activeTweens.get(target)!
        // @ts-expect-error 因为类型为 "string" 的表达式不能用于索引类型 "typeof Ease"
        tween.to(omit(args, ['@']), duration, createjs.Ease[ease])
        timer.addFinalizeMethod(() => tween.setPosition(tween.duration))
        return new Promise<void>((res) => tween.addEventListener('complete', () => res()))
    }

const Tween = { onActStart, init: tween, run: tween }
