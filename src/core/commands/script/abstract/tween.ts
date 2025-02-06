import type { CommandArg } from '@/core/types/Command'
import anime from 'animejs'
import { ActStartEvent } from '@/core/event'

// anime.suspendWhenDocumentHidden = true;
// test:缓动库自带了一个暂停,但是不知道有没有用

export type TweenCommandArgs = { target: object; ease?: string; duration: number }

const activeTimelines = new Map<object, anime.AnimeTimelineInstance>()

ActStartEvent.subscribe(() => activeTimelines.clear())

// 这里只保证同一个物体的缓动被顺序应用
export const _tween: Function1<
    TweenCommandArgs,
    Function1<Record<string, CommandArg | undefined>, anime.AnimeTimelineInstance>
> =
    ({ target, ease, duration }) =>
    (args) => {
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
        // animejs可以正确处理duration=0的情况
        // 但是必须在timeline结束之前订阅finished才有效
        const finished = sequence.finished
        const currentTime = sequence.currentTime
        sequence.add({ ...args, duration })
        // 因为调用add后默认重新从头开始
        sequence.seek(currentTime)
        // 神秘代码,防止一个已经结束的sequence在seek后仍然从头开始
        sequence.pause()
        sequence.play()
        return { ...sequence, finished }
    }
