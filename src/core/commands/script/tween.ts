import { CommandRunFunction } from '@/core/Command'
import anime from 'animejs/lib/anime.es.js'
import { omit } from 'es-toolkit'

export type TweenCommandArgs = { target: object; duration: number; ease: string }

const activeTweens = new Map<object, anime.AnimeTimelineInstance>()

const onActStart = () => activeTweens.clear()

const tween: CommandRunFunction<
    TweenCommandArgs & Exclude<Record<string, string | number | boolean>, TweenCommandArgs>
> =
    ({ timer }) =>
    async ({ target, ease, ...args }) => {
        await activeTweens.get(target)?.finished
        activeTweens.set(
            target,
            anime.timeline({
                targets: target,
                easing: ease
            })
        )
        const tween = activeTweens.get(target)!
        tween.add(omit(args, ['@', 'target', 'ease']))
        // queueMicrotask是为了正常触发complete事件
        timer.addFinalizeMethod(() => queueMicrotask(() => tween.seek(tween.duration)))
        return tween.finished
    }

export const Tween = { onActStart, init: tween, run: tween }
