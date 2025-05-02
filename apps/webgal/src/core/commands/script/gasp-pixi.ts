import type { ExtendArgs } from '@starnight/core'
import type { DisplayObject } from 'pixi.js'
import { Dynamic, EffectScope, NonBlocking, StarNight } from '@starnight/core'
import { isNil, isUndefined } from 'es-toolkit'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { PixiPlugin } from 'gsap/PixiPlugin'
import * as PIXI from 'pixi.js'
import { Application, Container, Sprite, Texture } from 'pixi.js'
import { Y } from '@/utils/fp'

// 为了实现在角色移动时进行表情变化,需要重新引入容器
// 角色表情切换以及背景的缓动都是用透明度做的,透明度不能直接应用给容器
// 但是移动必须直接应用给容器,来实现让几张同角色立绘一起移动
// 同时层级关系被容器掩盖,z-index必须直接赋值给容器
// 这些区分带来了一些混乱,但确实增强了功能,暂时不知道是好是坏

PixiPlugin.registerPIXI(PIXI)
gsap.registerPlugin(CustomEase)
gsap.registerPlugin(PixiPlugin)
gsap.defaults({ ease: 'none' })

declare module '@starnight/core' {
    interface GameUIInternalData {
        pixi: Application<HTMLCanvasElement>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.pixi = new Application({
        width: 1280,
        height: 720
    })
})

StarNight.ActEvents.ready.subscribe(({ ui: { pixi } }) => {
    Y<DisplayObject, void>((rec) => (displayObject) => {
        if (displayObject instanceof Sprite) {
            displayObject.texture = Texture.from(displayObject.name!)
        } else if (displayObject instanceof Container) {
            displayObject.children.forEach(rec)
        }
    })(pixi.stage)
})

StarNight.ActEvents.end.subscribe(({ ui: { pixi } }) => {
    const containers = pixi.stage.children as Container[]
    containers.forEach((container) => {
        container.children.slice(1).forEach((child) => child.destroy())
    })
})

export type SetImageCommandArgs = {
    id: string
    src: string
    zIndex?: number
} & ExtendArgs<PixiPlugin.Vars>

export const setimage = NonBlocking<SetImageCommandArgs>(
    ({
        state,
        ui: {
            pixi: { stage }
        }
    }) =>
        ({ id, src, zIndex, ...args }) => {
            let outerContainer: Container<Container<Sprite>>
            let innerContainer: Container<Sprite>
            const newSprite = new Sprite()
            if (stage.getChildByName(id)) {
                outerContainer = stage.getChildByName(id)!
                innerContainer = outerContainer.getChildAt(0)
                const oldSprite = innerContainer.getChildAt(0)
                newSprite.transform.position.copyFrom(oldSprite.transform.position)
                newSprite.transform.scale.copyFrom(oldSprite.transform.scale)
                newSprite.transform.rotation = oldSprite.transform.rotation
                newSprite.transform.pivot.copyFrom(oldSprite.transform.pivot)
                newSprite.transform.skew.copyFrom(oldSprite.transform.skew)
            } else {
                outerContainer = new Container()
                outerContainer.name = id
                innerContainer = new Container()
                outerContainer.addChild(innerContainer)
                stage.addChild(outerContainer)
            }
            if (!isUndefined(zIndex)) outerContainer.zIndex = zIndex
            if (state.isInitializing()) newSprite.name = src
            else newSprite.texture = Texture.from(src)
            gsap.set(newSprite, { pixi: args })
            innerContainer.addChildAt(newSprite, 0)
        }
)

declare module '@starnight/core' {
    interface GameTempData {
        activetimelines: Map<object, gsap.core.Timeline>
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
} & ExtendArgs<PixiPlugin.Vars>

export const tweenimage = Dynamic<TweenImageCommandArgs>(
    ({
        state,
        ui: {
            pixi: { stage }
        },
        temp: { activetimelines }
    }) =>
        function* ({ target, ease = 'none', duration = 0, inherit = true, ...args }) {
            const outerContainer = stage.getChildByName<Container>(target)
            const innerContainer = outerContainer?.getChildAt(0) as Container<Sprite>
            const tweenTarget = inherit ? innerContainer : innerContainer?.getChildAt(0)
            if (isNil(tweenTarget)) return
            if (state.isInitializing()) {
                gsap.set(tweenTarget, args)
            } else {
                // 保证对同一个物体的缓动被顺序应用
                if (!activetimelines.has(tweenTarget)) {
                    const timeline = gsap.timeline({ paused: false })
                    activetimelines.set(tweenTarget, timeline)
                }
                const timeline = activetimelines.get(tweenTarget)!
                const promise = new Promise<void>((res) =>
                    timeline.to(tweenTarget, {
                        pixi: args,
                        ease: gsap.parseEase(ease),
                        duration: duration / 1000,
                        onComplete: res
                    })
                )
                const current = timeline.duration()
                yield promise
                if (current === timeline.duration()) timeline.seek(timeline.duration())
            }
        }
)

export type CloseImageCommandArgs = XOR<{ target: string }, { exclude?: string }>

export const closeimage = NonBlocking<CloseImageCommandArgs>(
    ({
        ui: {
            pixi: { stage }
        }
    }) =>
        ({ target, exclude }) => {
            stage.children
                .filter((container) => (isUndefined(target) ? container.name !== exclude : container.name === target))
                .forEach((container) => stage.removeChild(container))
        }
)

export type ShakePunchCommandArgs = { target?: string; x?: number; y?: number; duration: number; iteration?: number }

// 因为tween命令使用translate参数,这里使用left和top避免冲突
export const shake = EffectScope(
    Dynamic<ShakePunchCommandArgs>(
        ({
            ui: {
                pixi: { stage }
            }
        }) =>
            function* ({ target, x = 0, y = 0, duration, iteration = 10 }) {
                const tweenTarget = isUndefined(target) ? stage : stage.getChildByName(target)
                const originX = 0
                const originY = 0
                const timeline = gsap.timeline()
                const dur = duration / 2 / iteration
                for (let i = 0; i < iteration; i++) {
                    const percentage = i / iteration
                    const diminishing = 1 - percentage
                    const nextX = originX + Math.random() * (x * diminishing * 2) - x * diminishing
                    const nextY = originY + Math.random() * (y * diminishing * 2) - y * diminishing
                    timeline.to(tweenTarget, { pixi: { x: nextX, y: nextY }, duration: dur / 1000 })
                }
                timeline.to(tweenTarget, { pixi: { x: originX, y: originY }, duration: dur / 1000 })
                yield new Promise((res) => timeline.eventCallback('onComplete', res))
            }
    )
)

export const punch = EffectScope(
    Dynamic<ShakePunchCommandArgs>(
        ({
            ui: {
                pixi: { stage }
            }
        }) =>
            function* ({ target, x = 0, y = 0, duration, iteration = 5 }) {
                const tweenTarget = isUndefined(target) ? stage : stage.getChildByName(target)
                const originX = 0
                const originY = 0
                const timeline = gsap.timeline()
                const dur = duration / 2 / iteration
                for (let i = 0; i < iteration; i++) {
                    const coef = i % 2 === 0 ? 1 : -1
                    const nextX = originX + (coef * x) / (i + 1)
                    const nextY = originY + (coef * y) / (i + 1)
                    timeline.to(tweenTarget!, { pixi: { x: nextX, y: nextY }, duration: dur / 1000 })
                }
                timeline.to(tweenTarget!, { pixi: { x: originX, y: originY }, duration: dur / 1000 })
                yield new Promise((res) => timeline.eventCallback('onComplete', res))
            }
    )
)
