import type { DisplayObject, Filter } from 'pixi.js'
import type { Except, MergeExclusive } from 'type-fest'
import { Dynamic, DynamicMacro, EffectScope, NonBlocking, StarNight } from '@starnight/core'
import { isString, isUndefined } from 'es-toolkit'
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'
import { Application, Container, Sprite, Texture, BlurFilter, ColorMatrixFilter } from 'pixi.js'
import { Y } from '@/utils/fp'
import { Tween } from '.'

gsap.registerPlugin(PixiPlugin)
PixiPlugin.registerPIXI({ Container, Sprite, BlurFilter, ColorMatrixFilter })

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
    // @ts-expect-error 类型...上不存在属性...
    globalThis['__PIXI_APP__'] = temp.pixi
})

StarNight.GameEvents.ready.subscribe(({ temp: { stage } }) => {
    Y<DisplayObject, void>((rec) => (displayObject) => {
        if (displayObject instanceof Sprite) {
            displayObject.texture = Texture.from(displayObject.name!)
            // @ts-expect-error 类型“Resource”上不存在属性“source”
            const source = displayObject.texture.baseTexture.resource.source
            if (source instanceof HTMLVideoElement) source.muted = true
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

export type ImageSetCommandArgs = { id: string, src: string, z?: number }

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
    if (state.isInitializing()) {
        newSprite.name = src
    } else {
        newSprite.texture = Texture.from(src)
        // @ts-expect-error 类型“Resource”上不存在属性“source”
        const source = newSprite.texture.baseTexture.resource.source
        if (source instanceof HTMLVideoElement) source.muted = true
    }
    innerContainer.addChildAt(newSprite, 0)
})

export type ImageCloseCommandArgs = MergeExclusive<
    { target: string | Array<string> },
    { exclude?: string | Array<string> }
>

export const close = NonBlocking<ImageCloseCommandArgs>(({ temp: { stage } }) => ({ target, exclude }) => {
    target = isString(target) ? [target] : target
    exclude = isString(exclude) ? [exclude] : isUndefined(exclude) ? [] : exclude
    if (target) {
        stage.children
            .filter((container) => target.includes(container.name!))
            .forEach((container) => stage.removeChild(container))
    } else {
        stage.children
            .filter((container) => !exclude.includes(container.name!))
            .forEach((container) => stage.removeChild(container))
    }
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
} & Except<
    PixiPlugin.Vars,
    | 'zIndex'
    | 'positionX'
    | 'positionY'
    | 'resolution'
    | 'tilePosition'
    | 'tilePositionX'
    | 'tilePositionY'
    | 'tileScale'
    | 'tileScaleX'
    | 'tileScaleY'
    | 'tileX'
    | 'tileY'
    | 'fillColor'
    | 'lineColor'
>

export const tween = DynamicMacro<ImageTweenCommandArgs>(
    ({ temp: { stage } }) =>
        function* ({ target: _target, inherit = true, duration, ...args }) {
            const innerContainer = stage.children.find((e) => e.name === _target)?.getChildAt(0)
            const target = inherit ? innerContainer : innerContainer?.getChildAt(0)
            if (isUndefined(target)) return
            yield Tween.apply({ target, duration, pixi: args })
        }
)

export type ImageFilterAddCommandArgs = { target: string, filter: Filter }

export const filter = NonBlocking<ImageFilterAddCommandArgs>(({ temp: { stage } }) => ({ target: _target, filter }) => {
    const target = isUndefined(_target) ? stage : stage.getChildByName(_target)
    if (target) {
        if (target.filters) target.filters.push(filter)
        else target.filters = [filter]
    }
})

export type ImageFilterTweenCommandArgs = {
    target: string
    index: number
    ease?: string
    duration?: number
} & Record<string, unknown>

export const filter_tween = DynamicMacro<ImageFilterTweenCommandArgs>(
    ({ temp: { stage } }) =>
        function* ({ target: _target, index, ...args }) {
            const container = isUndefined(_target) ? stage : stage.getChildByName(_target)
            const target = container?.filters?.[index]
            if (isUndefined(target)) return
            yield Tween.apply({ target, ...args })
        }
)
