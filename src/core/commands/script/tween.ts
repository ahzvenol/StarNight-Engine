import { CommandRunFunction } from '@/core/Command'
import { omit } from 'es-toolkit'

type EASE_KEYS = [
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
][number]

type TweenCommandArgs = { target: object; duration: number; transition: EASE_KEYS }

const activeTweens = new Map<object, createjs.Tween>()

const onActStart = () => activeTweens.clear()

const tween: CommandRunFunction<
    TweenCommandArgs & Exclude<Record<string, string | number | boolean>, TweenCommandArgs>
> =
    ({ timer }) =>
    ({ target, duration, transition, ...args }) => {
        if (!activeTweens.has(target)) activeTweens.set(target, createjs.Tween.get(target))
        const tween = activeTweens.get(target)!
        tween.to(omit(args, ['@']), duration, createjs.Ease[transition])
        timer.addFinalizeMethod(() => tween.setPosition(tween.duration))
        return new Promise<void>((res) => tween.addEventListener('complete', () => res()))
    }

const Tween = { onActStart, init: tween, run: tween }
