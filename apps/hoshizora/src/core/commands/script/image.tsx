import type { CommandArg, ExtendArgs } from 'starnight'
import anime from 'animejs'
import { isNil, isUndefined } from 'es-toolkit'
import { Dynamic, NonBlocking } from 'starnight'
import { ActEndEvent, ActStartEvent, GameInitCompleteEvent } from 'starnight'
import { GameState } from 'starnight'
import { useGameScopeSignal } from 'starnight'
import { Y } from '@/utils/fp'

// anime.suspendWhenDocumentHidden = true;
// test:缓动库自带了一个暂停,但是不知道有没有用

export type TweenCommandArgs = { target: object; ease?: string; duration: number }

const activeTimelines = new Map<object, anime.AnimeTimelineInstance>()

ActStartEvent.subscribe(() => activeTimelines.clear())

// 这里只保证同一个物体的缓动被顺序应用
const _tween: Function1<
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

// hoshizora特化的image命令
// 为了实现在角色移动时进行表情变化,需要重新引入容器
// 角色表情切换以及背景的缓动都是用透明度做的,透明度不能直接应用给容器
// 但是移动必须直接应用给容器,来实现让几张同角色立绘一起移动
// 同时层级关系被容器掩盖,z-index必须直接赋值给容器
// 这些区分带来了一些混乱,但确实增强了功能,暂时不知道是好是坏

export const UIStage = useGameScopeSignal<HTMLDivElement>(() => document.createElement('div'))

GameInitCompleteEvent.subscribe(() =>
    Y<Element, void>((rec) => (displayObject) => {
        Array.from(displayObject.children).forEach(rec)
        if (displayObject instanceof HTMLImageElement) {
            displayObject.src = displayObject.getAttribute('data-src')!
            displayObject.removeAttribute('data-src')!
        }
    })(UIStage())
)

// 一幕结束之后清理过期的图片元素
ActEndEvent.subscribe(() =>
    Array.from(UIStage().children).forEach((child) =>
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

export const setimage = NonBlocking<SetImageCommandArgs>((context) => ({ name, file, zIndex, ...args }) => {
    const stage = UIStage()
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
    inherit?: boolean
} & ExtendArgs<AnimatedPropertys>

export const tweenimage = Dynamic<TweenImageCommandArgs>(
    ({ state }) =>
        function* ({ target, ease, duration = 0, inherit = true, ...args }) {
            const container = UIStage().querySelector(`[data-name="${target}"]`)
            const tweenTarget = inherit ? container : container?.firstChild
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

export const closeimage = NonBlocking<CloseImageCommandArgs>(() => ({ target, exclude }) => {
    for (const e of UIStage().children) {
        const condition = isUndefined(target)
            ? e.getAttribute('data-name') !== exclude
            : e.getAttribute('data-name') === target
        if (condition) e.remove()
    }
})
