import type { ExtendArgs } from '@starnight/core'
import { Dynamic, EffectScope, NonBlocking, StarNight } from '@starnight/core'
import { isNil, isUndefined } from 'es-toolkit'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { PixiPlugin } from 'gsap/PixiPlugin'
import * as PIXI from 'pixi.js'
import { PromiseX } from '@/core/PromiseX'
import { Y } from '@/utils/fp'

// anime.suspendWhenDocumentHidden = true;
// test:缓动库自带了一个暂停,但是不知道有没有用

// 为了实现在角色移动时进行表情变化,需要重新引入容器
// 角色表情切换以及背景的缓动都是用透明度做的,透明度不能直接应用给容器
// 但是移动必须直接应用给容器,来实现让几张同角色立绘一起移动
// 同时层级关系被容器掩盖,z-index必须直接赋值给容器
// 这些区分带来了一些混乱,但确实增强了功能,暂时不知道是好是坏

PixiPlugin.registerPIXI(PIXI)
gsap.registerPlugin(CustomEase)
gsap.registerPlugin(PixiPlugin)

declare module '@starnight/core' {
    interface GameUIInternalData {
        stage: PIXI.Application
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.stage = new PIXI.Application({
        width: 1280,
        height: 720,
        backgroundColor: 0x000000,
        autoStart: true
    })
})

StarNight.ActEvents.ready.subscribe(({ ui: { stage } }) => {
    Y<PIXI.DisplayObject, void>((rec) => (displayObject) => {
        if (displayObject instanceof PIXI.Container) {
            displayObject.children.forEach(rec)
        } else if (displayObject instanceof PIXI.Sprite) {
            displayObject.texture = PIXI.Texture.from(displayObject.name!)
        }
    })(stage.stage)
})

StarNight.ActEvents.end.subscribe(({ ui: { stage } }) => {
    const containers = stage.stage.children as PIXI.Container[]
    containers.forEach((container) => {
        container.children.slice(1).forEach((child) => child.destroy())
    })
})

export type SetImageCommandArgs = {
    id: string
    src: string
    zIndex?: number
} & ExtendArgs<AnimatedPropertys>

export const setimage = NonBlocking<SetImageCommandArgs>(
    ({ state, ui: { stage } }) =>
        ({ id, src, zIndex, ...args }) => {
            let container = stage.stage.getChildByName(id) as PIXI.Container
            let newSprite: PIXI.Sprite
            if (container) {
                const oldSprite = container.getChildAt(0) as PIXI.Sprite
                newSprite = new PIXI.Sprite()
                newSprite.transform = oldSprite.transform
            } else {
                container = new PIXI.Container()
                container.name = id
                newSprite = new PIXI.Sprite()
                stage.stage.addChild(container)
            }
            if (!isUndefined(zIndex)) container.zIndex = zIndex
            if (state.isInitializing()) {
                newSprite.name = src
            } else {
                newSprite.texture = PIXI.Texture.from(src)
            }
            gsap.set(newSprite, args)
            container.addChildAt(newSprite, 0)
        }
)

declare module '@starnight/core' {
    interface GameTempData {
        activetimelines: Map<object, { timeline: gsap.core.Timeline; promises: PromiseX<void>[] }>
    }
}

StarNight.GameEvents.setup.subscribe(({ temp }) => {
    temp.activetimelines = new Map()
})

StarNight.ActEvents.start.subscribe(({ temp: { activetimelines } }) => {
    activetimelines.clear()
})

export type TweenCommandArgs = { target: object; ease?: string; duration: number }

export type TweenImageCommandArgs = {
    target: string
    ease?: string
    duration?: number
    inherit?: boolean
} & ExtendArgs<AnimatedPropertys>

export const tweenimage = Dynamic<TweenImageCommandArgs>(
    ({ state, ui: { stage }, temp: { activetimelines: activetimelines } }) =>
        function* ({ target, ease = 'none', duration = 0, inherit = true, ...args }) {
            const container = stage.stage.getChildByName(target) as PIXI.Container
            const tweenTarget = inherit ? container : container?.getChildAt(0)
            if (isNil(tweenTarget)) return
            if (state.isInitializing()) {
                gsap.set(tweenTarget, args)
            } else {
                // 保证对同一个物体的缓动被顺序应用
                if (!activetimelines.has(tweenTarget)) {
                    const timeline = gsap.timeline({ paused: false })
                    activetimelines.set(tweenTarget, { timeline, promises: [] })
                }
                const timeline = activetimelines.get(tweenTarget)!.timeline
                const promises = activetimelines.get(tweenTarget)!.promises
                const promise = new PromiseX<void>()
                timeline.to(tweenTarget, {
                    ease,
                    duration: duration / 1000,
                    pixi: args,
                    onComplete: promise.resolve
                })
                promises.push(promise)
                yield promise
                promises.forEach((p) => p.resolve())
                promises.length = 0
                // timeline.seek(timeline.duration())
            }
        }
)

export type CloseImageCommandArgs = XOR<{ target: string }, { exclude?: string }>

export const closeimage = NonBlocking<CloseImageCommandArgs>(({ ui: { stage } }) => ({ target, exclude }) => {
    stage.stage.children.forEach((container) => {
        const condition = isUndefined(target) ? container.name !== exclude : container.name === target
        if (condition) container.destroy({ children: true })
    })
})

export type ShakePunchCommandArgs = { target?: string; x?: number; y?: number; duration: number; iteration?: number }

// 因为tween命令使用translate参数,这里使用left和top避免冲突
// export const shake = EffectScope(
//     Dynamic<ShakePunchCommandArgs>(
//         ({ ui: { stage } }) =>
//             function* ({ target, x = 0, y = 0, duration, iteration = 10 }) {
//                 const realTarget = isUndefined(target) ? stage.stage : stage.stage.getChildByName(target)
//                 const originX = 0
//                 const originY = 0
//                 const sequence = anime.timeline({
//                     targets: realTarget,
//                     easing: 'linear'
//                 })
//                 const dur = duration / 2 / iteration
//                 for (let i = 0; i < iteration; i++) {
//                     const percentage = i / iteration
//                     const diminishing = 1 - percentage
//                     const nextX = originX + Math.random() * (x * diminishing * 2) - x * diminishing
//                     const nextY = originY + Math.random() * (y * diminishing * 2) - y * diminishing
//                     sequence.add({ left: nextX, top: nextY, duration: dur, direction: 'alternate' })
//                 }
//                 sequence.add({ left: originX, top: originY, duration: dur, direction: 'alternate' })
//                 yield sequence.finished
//             }
//     )
// )

// export const punch = EffectScope(
//     Dynamic<ShakePunchCommandArgs>(
//         ({ ui: { stage } }) =>
//             function* ({ target, x = 0, y = 0, duration, iteration = 5 }) {
//                 const realTarget = isUndefined(target) ? stage : stage.querySelector(`[data-id="${target}"]`)
//                 const originX = 0
//                 const originY = 0
//                 const sequence = anime.timeline({
//                     targets: realTarget,
//                     easing: 'linear'
//                 })
//                 const dur = duration / 2 / iteration
//                 for (let i = 0; i < iteration; i++) {
//                     const coef = i % 2 === 0 ? 1 : -1
//                     const nextX = originX + (coef * x) / (i + 1)
//                     const nextY = originY + (coef * y) / (i + 1)
//                     sequence.add({ left: nextX, top: nextY, duration: dur, direction: 'alternate' })
//                 }
//                 sequence.add({ left: originX, top: originY, duration: dur, direction: 'alternate' })
//                 yield sequence.finished
//             }
//     )
// )
