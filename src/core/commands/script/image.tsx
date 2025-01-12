import type { ExtendArgs } from '@/core/types/Command'
import anime from 'animejs'
import { isNil, isUndefined } from 'es-toolkit'
import { ActEndEvent, PostInitEvent } from '@/core/event'
import { Dynamic, NonBlocking } from '@/core/normalize'
import { GameState } from '@/core/types/Game'
import { Scope, useAutoResetSignal } from '@/core/utils/useAutoResetSignal'
import { Y } from '@/utils/fp'
import { _tween } from './abstract/tween'

export const stageView = useAutoResetSignal<HTMLDivElement>(() => document.createElement('div'), Scope.Game)

PostInitEvent.subscribe(() =>
    Y<Element, void>((rec) => (displayObject) => {
        Array.from(displayObject.children).forEach(rec)
        if (displayObject instanceof HTMLImageElement) {
            displayObject.src = displayObject.getAttribute('data-src')!
        }
    })(stageView())
)

// 一幕结束之后清理过期的图片元素
ActEndEvent.subscribe(() => {
    const children = Array.from(stageView().children)
    const seenDataAttributes = new Set<string>()
    for (const child of children) {
        const dataName = child.getAttribute('data-name')
        if (seenDataAttributes.has(dataName!)) {
            child.remove()
        } else {
            seenDataAttributes.add(dataName!)
        }
    }
})

// 跨幕环境变量file,需要收集副作用
export type SetImageCommandArgs = {
    name: string
    file: string
} & ExtendArgs<AnimatedPropertys>

export const setImage = NonBlocking<SetImageCommandArgs>((context) => ({ name, file, ...args }) => {
    const stage = stageView()
    const oldBitmap = stage.querySelector(`[data-name="${name}"]`)
    const newBitmap = (oldBitmap?.cloneNode() || <img data-name={name} />) as HTMLImageElement
    const attr = context.state === GameState.Init ? 'data-src' : 'src'
    newBitmap.setAttribute(attr, file)
    anime.set(newBitmap, args)
    stage.insertBefore(newBitmap, stage.firstChild)
})

export type TweenImageCommandArgs = {
    target: string
    ease?: string
    duration?: number
} & ExtendArgs<AnimatedPropertys>

export const tweenImage = Dynamic<TweenImageCommandArgs>(
    ({ state }) =>
        function* ({ target, ease, duration, ...args }) {
            const tweenTarget = stageView().querySelector(`[data-name="${target}"]`)
            if (isNil(tweenTarget)) return
            // 持续时间为0的动画不会触发finished事件
            if (state === GameState.Init || !duration) {
                anime.set(tweenTarget, args)
            } else {
                const sequence = _tween({ target: tweenTarget, ease, duration })(args)
                yield sequence.finished
                sequence.seek(sequence.duration)
            }
        }
)

export type CloseImageCommandArgs = XOR<{ target: string }, { exclude?: string }>

export const closeImage = NonBlocking<CloseImageCommandArgs>(() => ({ target, exclude }) => {
    Array.from(stageView().children).forEach((e) => {
        const condition = isUndefined(target)
            ? e.getAttribute('data-name') !== exclude
            : e.getAttribute('data-name') === target
        if (condition) e.remove()
    })
})
