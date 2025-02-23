import type { ExtendArgs } from '@/core/types/Command'
import anime from 'animejs'
import { isNil, isUndefined } from 'es-toolkit'
import { Dynamic, NonBlocking } from '@/core/command'
import { ActEndEvent, PostInitEvent } from '@/core/event'
import { GameState } from '@/core/types/Game'
import { useGameScopeSignal } from '@/core/utils/useScopeSignal'
import { Y } from '@/utils/fp'
import { _tween } from '../abstract/tween'

// hoshizora特化的image命令
// 为了实现在角色移动时进行表情变化,需要重新引入容器
// 角色表情切换以及背景的缓动都是用透明度做的,透明度不能直接应用给容器
// 但是移动必须直接应用给容器,来实现让几张同角色立绘一起移动
// 同时层级关系被容器掩盖,z-index必须直接赋值给容器
// 这些区分带来了一些混乱,但确实增强了功能,暂时不知道是好是坏

export const stageView = useGameScopeSignal<HTMLDivElement>(() => document.createElement('div'))

PostInitEvent.subscribe(() =>
    Y<Element, void>((rec) => (displayObject) => {
        Array.from(displayObject.children).forEach(rec)
        if (displayObject instanceof HTMLImageElement) {
            displayObject.src = displayObject.getAttribute('data-src')!
        }
    })(stageView())
)

// 一幕结束之后清理过期的图片元素
ActEndEvent.subscribe(() =>
    Array.from(stageView().children).forEach((child) =>
        Array.from(child.children)
            .slice(1)
            .forEach((child) => child.remove())
    )
)

// 跨幕环境变量file,需要收集副作用
export type SetImageCommandArgs = {
    name: string
    file: string
    zIndex?: string
} & ExtendArgs<AnimatedPropertys>

export const setImage = NonBlocking<SetImageCommandArgs>((context) => ({ name, file, zIndex, ...args }) => {
    const stage = stageView()
    let container = stage.querySelector(`[data-name="${name}"]`) as HTMLDivElement
    let newBitmap!: HTMLImageElement
    if (container) {
        const oldBitmap = container.firstChild!
        newBitmap = oldBitmap.cloneNode() as HTMLImageElement
    } else {
        container = (<div data-name={name} />) as HTMLDivElement
        newBitmap = document.createElement('img')
        stage.appendChild(container)
    }
    if (!isUndefined(zIndex)) container.style.zIndex = zIndex
    const attr = context.state === GameState.Init ? 'data-src' : 'src'
    newBitmap.setAttribute(attr, file)
    anime.set(newBitmap, args)
    container.insertBefore(newBitmap, container.firstChild)
})

export type TweenImageCommandArgs = {
    target: string
    ease?: string
    duration?: number
} & ExtendArgs<AnimatedPropertys>

export const tweenImage = Dynamic<TweenImageCommandArgs>(
    ({ state }) =>
        function* ({ target, ease, duration = 0, ...args }) {
            const container = stageView().querySelector(`[data-name="${target}"]`)
            const tweenTarget = isUndefined(args.opacity) ? container : container?.firstChild
            if (isNil(tweenTarget)) return
            if (state === GameState.Init) {
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
