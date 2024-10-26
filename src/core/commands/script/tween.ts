import { GameRuntimeContext } from '@/core/Command'
import anime from 'animejs/lib/anime.es.js'
import { omit } from 'es-toolkit'

export type TweenCommandArgs = { target: object; ease?: string; duration: number }

const activeTweens = new Map<object, anime.AnimeTimelineInstance>()

const onActStart = () => activeTweens.clear()

const tween: Function1<
    GameRuntimeContext,
    Function1<TweenCommandArgs, Function1<Record<string, string | number | boolean>, Promise<void>>>
> =
    ({ timer }) =>
    ({ target, ease, duration }) =>
    async (args) => {
        await activeTweens.get(target)?.finished
        activeTweens.set(
            target,
            anime.timeline({
                targets: target,
                easing: ease || 'linear'
            })
        )
        const tween = activeTweens.get(target)!
        tween.add({ ...omit(args, ['@']), duration })
        // queueMicrotask是为了正常触发complete事件
        timer.addFinalizeMethod(() => queueMicrotask(() => tween.seek(tween.duration)))
        return tween.finished
    }

export const Tween = { onActStart, init: tween, run: tween }
