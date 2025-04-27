import type { ExtendArgs } from '@starnight/core'
import { Dynamic, EffectScope, NonBlocking, StarNight } from '@starnight/core'
import anime from 'animejs'
import { isNil, isUndefined } from 'es-toolkit'
import { Y } from '@/utils/fp'

// anime.suspendWhenDocumentHidden = true;
// test:缓动库自带了一个暂停,但是不知道有没有用

// 为了实现在角色移动时进行表情变化,需要重新引入容器
// 角色表情切换以及背景的缓动都是用透明度做的,透明度不能直接应用给容器
// 但是移动必须直接应用给容器,来实现让几张同角色立绘一起移动
// 同时层级关系被容器掩盖,z-index必须直接赋值给容器
// 这些区分带来了一些混乱,但确实增强了功能,暂时不知道是好是坏

declare module '@starnight/core' {
    interface GameTempData {
        activetimelines: Map<object, anime.AnimeTimelineInstance>
    }
    interface GameUIInternalData {
        stage: HTMLDivElement
    }
}

StarNight.GameEvents.setup.subscribe(({ temp, ui }) => {
    temp.activetimelines = new Map()
    ui.stage = document.createElement('div')
})

StarNight.ActEvents.start.subscribe(({ temp: { activetimelines: activetimelines } }) => {
    activetimelines.clear()
})

StarNight.ActEvents.ready.subscribe(({ ui: { stage } }) => {
    Y<Element, void>((rec) => (displayObject) => {
        Array.from(displayObject.children).forEach(rec)
        if (displayObject instanceof HTMLImageElement) {
            displayObject.src = displayObject.getAttribute('data-src')!
            displayObject.removeAttribute('data-src')!
        }
    })(stage)
})

StarNight.ActEvents.end.subscribe(({ ui: { stage } }) => {
    Array.from(stage.children).forEach((child) =>
        Array.from(child.children)
            .slice(1)
            .forEach((child) => child.remove())
    )
})

export type SetImageCommandArgs = {
    id: string
    src: string
    zIndex?: number
} & ExtendArgs<AnimatedPropertys>

export const setimage = NonBlocking<SetImageCommandArgs>(
    ({ state, ui: { stage } }) =>
        ({ id, src, zIndex, ...args }) => {
            let container = stage.querySelector(`[data-id="${id}"]`) as HTMLElement
            let newBitmap!: HTMLImageElement
            if (container) {
                const oldBitmap = container.firstChild!
                newBitmap = oldBitmap.cloneNode() as HTMLImageElement
            } else {
                container = document.createElement('div')
                container.setAttribute('data-id', id)
                newBitmap = document.createElement('img')
                stage.appendChild(container)
            }
            if (!isUndefined(zIndex)) container.style.zIndex = zIndex.toString()
            const attr = state.isInitializing() ? 'data-src' : 'src'
            newBitmap.setAttribute(attr, src)
            anime.set(newBitmap, args)
            container.insertBefore(newBitmap, container.firstChild)
        }
)

export type TweenCommandArgs = { target: object; ease?: string; duration: number }

export type TweenImageCommandArgs = {
    target: string
    ease?: string
    duration?: number
    inherit?: boolean
} & ExtendArgs<AnimatedPropertys>

export const tweenimage = Dynamic<TweenImageCommandArgs>(
    ({ state, ui: { stage }, temp: { activetimelines: activetimelines } }) =>
        function* ({ target, ease, duration = 0, inherit = true, ...args }) {
            const container = stage.querySelector(`[data-id="${target}"]`)
            const tweenTarget = inherit ? container : container?.firstChild
            if (isNil(tweenTarget)) return
            if (state.isInitializing()) {
                anime.set(tweenTarget, args)
            } else {
                // // 保证对同一个物体的缓动被顺序应用
                if (!activetimelines.has(tweenTarget)) {
                    activetimelines.set(
                        tweenTarget,
                        anime.timeline({
                            targets: tweenTarget
                        })
                    )
                }
                const sequence = activetimelines.get(tweenTarget)!
                // animejs可以正确处理duration=0的情况
                // 但是必须在timeline结束之前订阅finished才有效
                const finished = sequence.finished
                const currentTime = sequence.currentTime
                sequence.add({ easing: ease || 'linear', duration, ...args })
                // 因为调用add后默认重新从头开始
                sequence.seek(currentTime)
                // 神秘代码,防止一个已经结束的sequence在seek后仍然从头开始
                sequence.pause()
                sequence.play()
                yield finished
                sequence.seek(sequence.duration)
            }
        }
)

export type CloseImageCommandArgs = XOR<{ target: string }, { exclude?: string }>

export const closeimage = NonBlocking<CloseImageCommandArgs>(({ ui: { stage } }) => ({ target, exclude }) => {
    Array.from(stage.children).forEach((e) => {
        const condition = isUndefined(target)
            ? e.getAttribute('data-id') !== exclude
            : e.getAttribute('data-id') === target
        if (condition) e.remove()
    })
})

export type ShakePunchCommandArgs = { target?: string; x?: number; y?: number; duration: number; iteration?: number }

// 因为tween命令使用translate参数,这里使用left和top避免冲突
export const shake = EffectScope(
    Dynamic<ShakePunchCommandArgs>(
        ({ ui: { stage } }) =>
            function* ({ target, x = 0, y = 0, duration, iteration = 10 }) {
                const realTarget = isUndefined(target) ? stage : stage.querySelector(`[data-id="${target}"]`)
                const originX = 0
                const originY = 0
                const sequence = anime.timeline({
                    targets: realTarget,
                    easing: 'linear'
                })
                const dur = duration / 2 / iteration
                for (let i = 0; i < iteration; i++) {
                    const percentage = i / iteration
                    const diminishing = 1 - percentage
                    const nextX = originX + Math.random() * (x * diminishing * 2) - x * diminishing
                    const nextY = originY + Math.random() * (y * diminishing * 2) - y * diminishing
                    sequence.add({ left: nextX, top: nextY, duration: dur, direction: 'alternate' })
                }
                sequence.add({ left: originX, top: originY, duration: dur, direction: 'alternate' })
                yield sequence.finished
            }
    )
)

export const punch = EffectScope(
    Dynamic<ShakePunchCommandArgs>(
        ({ ui: { stage } }) =>
            function* ({ target, x = 0, y = 0, duration, iteration = 5 }) {
                const realTarget = isUndefined(target) ? stage : stage.querySelector(`[data-id="${target}"]`)
                const originX = 0
                const originY = 0
                const sequence = anime.timeline({
                    targets: realTarget,
                    easing: 'linear'
                })
                const dur = duration / 2 / iteration
                for (let i = 0; i < iteration; i++) {
                    const coef = i % 2 === 0 ? 1 : -1
                    const nextX = originX + (coef * x) / (i + 1)
                    const nextY = originY + (coef * y) / (i + 1)
                    sequence.add({ left: nextX, top: nextY, duration: dur, direction: 'alternate' })
                }
                sequence.add({ left: originX, top: originY, duration: dur, direction: 'alternate' })
                yield sequence.finished
            }
    )
)
