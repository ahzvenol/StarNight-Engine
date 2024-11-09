import type { CommandArg, GameRuntimeContext } from '@/core/type'
import anime from 'animejs/lib/anime.es.js'
import { omit } from 'es-toolkit'
import { ActStartEvent } from '@/core/event'
import { State } from '@/core/type'

// anime.suspendWhenDocumentHidden = true;
// test:缓动库自带了一个暂停,但是不知道有没有用

export type TweenCommandArgs = { target: object; ease?: string; duration: number }

const activeTimelines = new Map<object, anime.AnimeTimelineInstance>()

ActStartEvent.subscribe(() => activeTimelines.clear())

const tween: Function1<
    GameRuntimeContext,
    Function1<TweenCommandArgs, Function1<Record<string, CommandArg>, Promise<void>>>
> =
    ({ state, timer }) =>
    ({ target, ease, duration }) =>
    async (args) => {
        if (!activeTimelines.has(target)) {
            activeTimelines.set(
                target,
                anime.timeline({
                    targets: target,
                    easing: ease || 'linear'
                })
            )
        }
        const sequence = activeTimelines.get(target)!
        const currentTime = sequence.currentTime
        sequence.add({ ...omit(args, ['@']), duration })
        // 因为调用add后默认重新从头开始
        sequence.seek(currentTime)
        // queueMicrotask是为了正常触发complete事件
        // 立即结束缓动太过突兀,更好的效果是不管它
        if (state === State.Init) timer.addFinalizeMethod(() => queueMicrotask(() => sequence.seek(sequence.duration)))
        return sequence.finished
    }

export const Tween = tween
