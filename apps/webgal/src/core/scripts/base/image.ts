import type { DisplayObject, Filter } from 'pixi.js'
import type { Except, MergeExclusive } from 'type-fest'
import { Dynamic, DynamicMacro, EffectScope, NonBlocking, StarNight } from '@starnight/core'
import { isUndefined } from 'es-toolkit'
import { gsap } from 'gsap'
import { Application, Container, Sprite, Texture } from 'pixi.js'
import { Y } from '@/utils/fp'
import { Tween } from '.'

declare module '@starnight/core' {
    interface GameUIInternalData {
        view: HTMLCanvasElement
    }
    interface GameTempData {
        pixi: Application<HTMLCanvasElement>
        stage: Container<Container<Container<Sprite>>>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui, temp }) => {
    temp.pixi = new Application({ width: 1280, height: 720 })
    ui.view = temp.pixi.view
    temp.stage = temp.pixi.stage as Container<Container<Container<Sprite>>>
    // @ts-expect-error 类型“typeof globalThis”上不存在属性“__PIXI_APP__”。
    globalThis['__PIXI_APP__'] = temp.pixi
})

StarNight.ActEvents.ready.subscribe(({ temp: { stage } }) => {
    Y<DisplayObject, void>((rec) => (displayObject) => {
        if (displayObject instanceof Sprite) {
            displayObject.texture = Texture.from(displayObject.name!)
        } else if (displayObject instanceof Container) {
            displayObject.children.forEach(rec)
        }
    })(stage)
})

// 在幕结束时清理,每个容器下只保留一个Sprite
StarNight.ActEvents.end.subscribe(({ temp: { stage } }) => {
    const containers = stage.children as Container<Container<Sprite>>[]
    containers.forEach((container) => {
        container.children.forEach((container) => {
            container.children.slice(1).forEach((child) => child.destroy())
        })
    })
})

export type ImageSetCommandArgs = { id: string; src: string; z?: number }

export const set = NonBlocking<ImageSetCommandArgs>(({ state, temp: { stage } }) => ({ id, src, z }) => {
    // 外层容器用于摇晃效果,内层容器用于变换效果
    let outerContainer: Container<Container<Sprite>>
    let innerContainer: Container<Sprite>
    const newSprite = new Sprite()
    if (stage.getChildByName(id)) {
        outerContainer = stage.getChildByName(id)!
        innerContainer = outerContainer.getChildAt(0)
    } else {
        outerContainer = new Container()
        outerContainer.name = id
        innerContainer = new Container()
        outerContainer.addChild(innerContainer)
        stage.addChild(outerContainer)
    }
    if (!isUndefined(z)) outerContainer.zIndex = z
    if (state.isInitializing()) newSprite.name = src
    else newSprite.texture = Texture.from(src)
    innerContainer.addChildAt(newSprite, 0)
})

export type ImageCloseCommandArgs = MergeExclusive<{ target: string }, { exclude?: Array<string> }>

export const close = NonBlocking<ImageCloseCommandArgs>(({ temp: { stage } }) => ({ target, exclude }) => {
    stage.children
        .filter((container) => (isUndefined(target) ? !exclude?.includes(container.name!) : container.name === target))
        .forEach((container) => stage.removeChild(container))
})

export type ImageShakePunchCommandArgs = {
    target?: string
    x?: number
    y?: number
    duration: number
    iteration?: number
}

export const shake = EffectScope(
    Dynamic<ImageShakePunchCommandArgs>(
        ({ temp: { stage } }) =>
            function* ({ target: _target, x = 0, y = 0, duration, iteration = 10 }) {
                const target = isUndefined(_target) ? stage : stage.getChildByName(_target)
                const originX = 0
                const originY = 0
                const timeline = gsap.timeline()
                const dur = duration / 2 / iteration
                for (let i = 0; i < iteration; i++) {
                    const percentage = i / iteration
                    const diminishing = 1 - percentage
                    const nextX = originX + Math.random() * (x * diminishing * 2) - x * diminishing
                    const nextY = originY + Math.random() * (y * diminishing * 2) - y * diminishing
                    timeline.to(target, { pixi: { x: nextX, y: nextY }, duration: dur / 1000 })
                }
                timeline.to(target, { pixi: { x: originX, y: originY }, duration: dur / 1000 })
                yield new Promise((res) => timeline.eventCallback('onComplete', res))
            }
    )
)

export const punch = EffectScope(
    Dynamic<ImageShakePunchCommandArgs>(
        ({ temp: { stage } }) =>
            function* ({ target: _target, x = 0, y = 0, duration, iteration = 5 }) {
                const target = isUndefined(_target) ? stage : stage.getChildByName(_target)
                const originX = 0
                const originY = 0
                const timeline = gsap.timeline()
                const dur = duration / 2 / iteration
                for (let i = 0; i < iteration; i++) {
                    const coef = i % 2 === 0 ? 1 : -1
                    const nextX = originX + (coef * x) / (i + 1)
                    const nextY = originY + (coef * y) / (i + 1)
                    timeline.to(target!, { pixi: { x: nextX, y: nextY }, duration: dur / 1000 })
                }
                timeline.to(target!, { pixi: { x: originX, y: originY }, duration: dur / 1000 })
                yield new Promise((res) => timeline.eventCallback('onComplete', res))
            }
    )
)

export type ImageTweenCommandArgs = {
    target: string
    ease?: string
    duration?: number
    inherit?: boolean
} & Except<PixiPlugin.Vars, 'zIndex'>

export const tween = DynamicMacro<ImageTweenCommandArgs>(
    ({ temp: { stage } }) =>
        async function* ({ target: _target, ease = 'none', duration = 0, inherit = true, ...args }) {
            const innerContainer = stage.children.find((e) => e.name === _target)?.getChildAt(0)
            const target = inherit ? innerContainer : innerContainer?.getChildAt(0)
            yield Tween.apply({ target, ease, duration, pixi: args })
        }
)

export type ImageFilterAddCommandArgs = { target: string; filter: Filter }

export const filter = NonBlocking<ImageFilterAddCommandArgs>(({ temp: { stage } }) => ({ target: _target, filter }) => {
    const target = isUndefined(_target) ? stage : stage.getChildByName(_target)
    target?.filters?.push(filter)
})

export type ImageFilterTweenCommandArgs = {
    target: string
    index: number
    ease?: string
    duration?: number
} & Record<string, unknown>

export const filter_tween = DynamicMacro<ImageFilterTweenCommandArgs>(
    ({ temp: { stage } }) =>
        async function* ({ target: _target, index, ease = 'none', duration = 0, ...args }) {
            const container = isUndefined(_target) ? stage : stage.getChildByName(_target)
            const target = container?.filters?.[index]
            yield Tween.apply({ target, ease, duration, ...args })
        }
)
