import type { DisplayObject, Filter } from 'pixi.js'
import type { Except, MergeExclusive } from 'type-fest'
import type { TweenCommandArgs } from './tween'
import { Dynamic, DynamicMacro, EffectScope, NonBlocking, StarNight } from '@starnight/core'
import { isString, isUndefined } from 'es-toolkit'
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'
import { Application, Container, Sprite, Texture, BlurFilter, ColorMatrixFilter } from 'pixi.js'
import { Y } from '@/utils/fp'
import { Tween } from '.'

gsap.registerPlugin(PixiPlugin)
PixiPlugin.registerPIXI({ Container, Sprite, BlurFilter, ColorMatrixFilter })

type ImageStage = Container<Container<Container<Sprite>>>

type ImageTargetStage = 0

type ImageTargetSprite = string

type ImageTarget = ImageTargetSprite | ImageTargetStage

declare module '@starnight/core' {
    interface GameUIExternalData {
        view: HTMLCanvasElement
    }
    interface GameTempData {
        pixi: Application<HTMLCanvasElement>
        stage: ImageStage
    }
}

StarNight.GameEvents.setup.subscribe(({ ui: { view }, temp }) => {
    const { width, height } = view
    temp.pixi = new Application({ view, width, height })
    temp.stage = temp.pixi.stage as ImageStage
    // @ts-expect-error 类型...上不存在属性...
    globalThis['__PIXI_APP__'] = temp.pixi
})

StarNight.GameEvents.ready.subscribe(({ temp: { stage } }) => {
    Y<DisplayObject, void>((rec) => (object) => {
        if (object instanceof Sprite) {
            object.texture = Texture.from(object.name!)
            // @ts-expect-error 类型“Resource”上不存在属性“source”
            const source = object.texture.baseTexture.resource.source
            if (source instanceof HTMLVideoElement) source.muted = true
        } else if (object instanceof Container) {
            object.children.forEach(rec)
        }
    })(stage)
})

// 在幕结束时清理,每个容器下只保留一个Sprite
StarNight.ActEvents.end.subscribe(({ temp: { stage } }) => {
    stage.children.forEach((container) => {
        container.children.forEach((container) => {
            container.children.slice(1).forEach((child) => child.destroy())
        })
    })
})

export type ImageSetCommandArgs = { id: string, src: string, z?: number }

export const set = NonBlocking<ImageSetCommandArgs>(({ state, temp: { stage } }) => ({ id, src, z }) => {
    // 外层容器用于摇晃效果,内层容器用于变换效果
    let outerContainer: ImageStage['children'][number]
    let innerContainer: ImageStage['children'][number]['children'][number]
    const sprite = new Sprite()
    sprite.anchor.set(0.5)
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
        sprite.name = src
    } else {
        sprite.texture = Texture.from(src)
        sprite.texture.baseTexture.once('loaded', () => {
            sprite.position = { x: sprite.texture.orig.width / 2, y: sprite.texture.orig.height / 2 }
        })
        // @ts-expect-error 类型“Resource”上不存在属性“source”
        const source = sprite.texture.baseTexture.resource.source
        if (source instanceof HTMLVideoElement) source.muted = true
    }
    innerContainer.addChildAt(sprite, 0)
})

export type ImageCloseCommandArgs = MergeExclusive<
    { target: ImageTargetSprite | Array<ImageTargetSprite> },
    { exclude?: ImageTargetSprite | Array<ImageTargetSprite> }
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

export type ImageShakePunchCommandArgs =
    { target: ImageTarget, duration: number, iteration?: number }
    & ({ x: number, y?: number } | { x?: number, y: number })

export const shake = EffectScope(
    Dynamic<ImageShakePunchCommandArgs>(
        ({ temp: { stage } }) =>
            function* ({ target: _target, x = 0, y = 0, duration, iteration = 10 }) {
                const target = _target === 0 ? stage : stage.getChildByName(_target)
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
            function* ({ target: _target, x = 0, y = 0, duration }) {
                const target = _target === 0 ? stage : stage.getChildByName(_target)
                const punch = (p: number) => (p === 0 || p === 1) ? 0 : Math.pow(2, -10 * p) * Math.sin((20 * Math.PI * p) / 3)
                const timeline = gsap.timeline()
                timeline.to(target!, { ease: punch, pixi: { x, y }, duration: duration / 1000 })
                // timeline.to(target!, { pixi: { x: originX, y: originY }})
                yield new Promise((res) => timeline.eventCallback('onComplete', res))
            }
    )
)

export type ImageTweenCommandArgs =
    { target: ImageTarget, ease?: TweenCommandArgs['ease'], duration?: number, inherit?: boolean }
    & Except<
        PixiPlugin.Vars,
        'zIndex' | 'positionX' | 'positionY' | 'resolution' | 'fillColor' | 'lineColor'
        | 'tilePosition' | 'tilePositionX' | 'tilePositionY' | 'tileScale' | 'tileScaleX' | 'tileScaleY' | 'tileX' | 'tileY'
    >

export const tween = DynamicMacro<ImageTweenCommandArgs>(
    ({ temp: { stage } }) =>
        function* ({ target: _target, inherit = true, duration, ...args }) {
            const container = _target === 0 ? undefined : stage.children.find((e) => e.name === _target)?.getChildAt(0)
            const target = _target === 0 ? stage : inherit ? container : container?.getChildAt(0)
            if (isUndefined(target)) return
            yield Tween.apply({ target, duration, pixi: args })
        }
)

export type ImageFilterCommandArgs = { target: ImageTarget, filter: Filter }

export const filter = NonBlocking<ImageFilterCommandArgs>(({ temp: { stage } }) => ({ target: _target, filter }) => {
    const target = _target === 0 ? stage : stage.getChildByName(_target)
    if (target) {
        if (target.filters) target.filters.push(filter)
        else target.filters = [filter]
    }
})
