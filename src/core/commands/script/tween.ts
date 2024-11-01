import type { CommandArg, GameRuntimeContext } from '@/core/type'
import anime from 'animejs/lib/anime.es.js'
import { omit } from 'es-toolkit'
import { State } from '@/core/type'

// anime.suspendWhenDocumentHidden = true;
// test:缓动库自带了一个暂停,但是不知道有没有用

export type TweenCommandArgs = { target: object; ease?: string; duration: number }

const activeTweens = new Map<object, anime.AnimeTimelineInstance>()

const beforeActStart = () => activeTweens.clear()

const tween: Function1<
    GameRuntimeContext,
    Function1<TweenCommandArgs, Function1<Record<string, CommandArg>, Promise<void>>>
> =
    ({ state, timer }) =>
    ({ target, ease, duration }) =>
    async (args) => {
        if (!activeTweens.has(target)) {
            activeTweens.set(
                target,
                anime.timeline({
                    targets: target,
                    easing: ease || 'linear'
                })
            )
        }
        const tween = activeTweens.get(target)!
        const currentTime = tween.currentTime
        tween.add({ ...omit(args, ['@']), duration })
        // 因为调用add后默认重新从头开始
        tween.seek(currentTime)
        // queueMicrotask是为了正常触发complete事件
        // 立即结束缓动太过突兀,更好的效果是不管它
        if (state === State.Init) timer.addFinalizeMethod(() => queueMicrotask(() => tween.seek(tween.duration)))
        return tween.finished
    }

export const Tween = tween

export const TweenHooks = { beforeActStart }
