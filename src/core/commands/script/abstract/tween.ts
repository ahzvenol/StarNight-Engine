import type { CommandArg } from '@/core/types/Command'
import anime from 'animejs'
import { ActStartEvent } from '@/core/event'

// anime.suspendWhenDocumentHidden = true;
// test:缓动库自带了一个暂停,但是不知道有没有用

export type TweenCommandArgs = { target: object; ease?: string; duration: number }

const activeTimelines = new Map<object, anime.AnimeTimelineInstance>()

ActStartEvent.subscribe(() => activeTimelines.clear())

// 不同命令对于Fast模式的行为不同,这里只保证同一个物体的缓动被顺序应用
export const _tween: Function1<TweenCommandArgs, Function1<Record<string, CommandArg>, anime.AnimeTimelineInstance>> =
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
        const currentTime = sequence.currentTime
        sequence.add({ ...args, duration })
        // 因为调用add后默认重新从头开始
        sequence.seek(currentTime)
        return sequence
    }
