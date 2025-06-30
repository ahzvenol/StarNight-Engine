import type { Filter, ImageResource } from 'pixi.js'
import type { Except, MergeExclusive } from 'type-fest'
import type { TweenCommandArgs } from '../tween'
import { Dynamic, DynamicMacro, EffectScope, NonBlocking, StarNight } from '@starnight/core'
import { isUndefined, random } from 'es-toolkit'
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'
import { Application, Container, Sprite, BlurFilter, ColorMatrixFilter, Transform, Texture, BLEND_MODES } from 'pixi.js'
import { Tween } from '../index'
import { RenderLayerSprite } from './RenderLayerSprite'
import { SrcSprite } from './SrcSprite'
import { NestedContainer } from './NestedContainer'

gsap.registerPlugin(PixiPlugin)
PixiPlugin.registerPIXI({ Container, Sprite, BlurFilter, ColorMatrixFilter })
Transform.prototype.updateLocalTransform = function (): void {
    const lt = this.localTransform

    if (this._localID !== this._currentLocalID) {
        // get the matrix values of the displayobject based on its transform properties..
        lt.a = this._cx * this.scale.x
        lt.b = this._sx * this.scale.x
        lt.c = this._cy * this.scale.y
        lt.d = this._sy * this.scale.y

        lt.tx = this.position.x + this.pivot.x - (this.pivot.x * lt.a + this.pivot.y * lt.c)
        lt.ty = this.position.y + this.pivot.y - (this.pivot.x * lt.b + this.pivot.y * lt.d)
        this._currentLocalID = this._localID

        // force an update..
        this._parentID = -1
    }
}
Transform.prototype.updateTransform = function (parentTransform: Transform): void {
    const lt = this.localTransform

    if (this._localID !== this._currentLocalID) {
        // get the matrix values of the displayobject based on its transform properties..
        lt.a = this._cx * this.scale.x
        lt.b = this._sx * this.scale.x
        lt.c = this._cy * this.scale.y
        lt.d = this._sy * this.scale.y

        lt.tx = this.position.x + this.pivot.x - (this.pivot.x * lt.a + this.pivot.y * lt.c)
        lt.ty = this.position.y + this.pivot.y - (this.pivot.x * lt.b + this.pivot.y * lt.d)
        this._currentLocalID = this._localID

        // force an update..
        this._parentID = -1
    }

    if (this._parentID !== parentTransform._worldID) {
        // concat the parent matrix with the objects transform.
        const pt = parentTransform.worldTransform
        const wt = this.worldTransform

        wt.a = lt.a * pt.a + lt.b * pt.c
        wt.b = lt.a * pt.b + lt.b * pt.d
        wt.c = lt.c * pt.a + lt.d * pt.c
        wt.d = lt.c * pt.b + lt.d * pt.d
        wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx
        wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty

        this._parentID = parentTransform._worldID

        // update the id of the transform..
        this._worldID++
    }
}

// 第一层容器用于舞台特殊动画,第二层容器用于舞台动画,第三层容器用于元素特殊动画,第四层容器用于元素动画
type ImageItem = NestedContainer<NestedContainer<NestedContainer<Container<SrcSprite>>>>

type ImageLayer = RenderLayerSprite<ImageItem>

type ImageStage = Container<ImageLayer>

export type ImageTargetStage = 0

export type ImageTargetBackground = 1

export type ImageTargetSprite = string

export type ImageTarget = ImageTargetSprite | ImageTargetBackground | ImageTargetStage

declare module '@starnight/core' {
    interface GameUIExternalData {
        view: HTMLCanvasElement
    }
    interface GameTempData {
        pixi: Application<HTMLCanvasElement>
        stage: ImageStage
    }
}

function load(sprite: SrcSprite) {
    sprite.texture = Texture.from(sprite.src)
    const handleLoaded = () => {
        if (sprite.destroyed) return
        sprite.pivot = { x: sprite.texture.orig.width / 2, y: sprite.texture.orig.height / 2 }
        if (sprite.parent) {
            sprite.parent.pivot = { x: sprite.texture.orig.width / 2, y: sprite.texture.orig.height / 2 }
        }
    }
    if (sprite.texture.baseTexture.valid) handleLoaded()
    else sprite.texture.baseTexture.once('loaded', handleLoaded)
    const resource = sprite.texture.baseTexture.resource as ImageResource
    if (resource.source instanceof HTMLVideoElement) resource.source.muted = true
}

function find(target: ImageTargetSprite | ImageTargetBackground, stage: ImageStage): ImageLayer | undefined {
    return stage.children.find((layer) => layer.label === target)
}

StarNight.GameEvents.setup.subscribe(({ ui: { view }, temp }) => {
    const { width, height } = view
    const container = new Container()
    container.pivot = { x: width / 2, y: height / 2 }
    temp.pixi = new Application({ view, width, height })
    temp.stage = temp.pixi.stage as ImageStage
    // @ts-expect-error 类型...上不存在属性...
    globalThis['__PIXI_APP__'] = temp.pixi
})

StarNight.GameEvents.ready.subscribe(({ temp: { stage } }) => {
    stage.children.forEach((layer) => {
        layer.internal.internal.internal.internal.children.forEach((sprite) => load(sprite))
    })
})

// 在幕结束时清理,每个容器下只保留一个Sprite
StarNight.ActEvents.end.subscribe(({ temp: { stage } }) => {
    stage.children.forEach((layer) => {
        layer.internal.internal.internal.internal.children.slice(0, -1).forEach((sprite) => sprite.destroy())
    })
})

export type ImageSetCommandArgs = { id: ImageTargetSprite | ImageTargetBackground, src: string, z?: number }

export const set = NonBlocking<ImageSetCommandArgs>(
    ({ state, ui: { view }, temp: { stage } }) =>
        ({ id, src, z }) => {
            let container: ImageItem | undefined
            const sprite = new SrcSprite(src)
            // 实现立绘切换的交叉溶解效果
            if (id !== 1) sprite.blendMode = BLEND_MODES.ADD
            container = find(id, stage)?.internal
            if (!container) {
                const { width, height } = view
                container = new NestedContainer(new NestedContainer(new NestedContainer(new Container<SrcSprite>())))
                const layer = new RenderLayerSprite(container, { width, height, label: id })
                stage.addChild(layer)
            }
            if (!state.isInitializing()) load(sprite)
            if (!isUndefined(z)) container.zIndex = z
            container.internal.internal.internal.addChild(sprite)
        }
)

export type ImageCloseCommandArgs = MergeExclusive<
    { target: ImageTargetSprite | ImageTargetBackground | Array<ImageTargetSprite | ImageTargetBackground> },
    { exclude?: ImageTargetSprite | ImageTargetBackground | Array<ImageTargetSprite | ImageTargetBackground> }
>

export const close = NonBlocking<ImageCloseCommandArgs>(
    ({ temp: { stage } }) =>
        ({ target: _target, exclude: _exclude }) => {
            const target: Array<unknown> = Array.isArray(_target) ? _target : isUndefined(_target) ? [] : [_target]
            const exclude: Array<unknown> = Array.isArray(_exclude) ? _exclude : isUndefined(_exclude) ? [] : [_exclude]
            if (target.length > 0) {
                stage.children
                    .filter((layer) => target.includes(layer.label))
                    .forEach((layer) => stage.removeChild(layer))
            } else {
                stage.children
                    .filter((layer) => !exclude.includes(layer.label))
                    .forEach((layer) => stage.removeChild(layer))
            }
        }
)

type OmitIndexSignature<T> = {
    [K in keyof T as
    string extends K ? never :
        number extends K ? never :
            K
    ]: T[K];
}

export type ImageTweenArgs = OmitIndexSignature<Except<
    PixiPlugin.Vars,
    'zIndex' | 'positionX' | 'positionY' | 'resolution' | 'fillColor' | 'lineColor' | 'rotation' | 'autoAlpha' | 'tint'
    | 'tilePosition' | 'tilePositionX' | 'tilePositionY' | 'tileScale' | 'tileScaleX' | 'tileScaleY' | 'tileX' | 'tileY'
>>

export type ImageTweenCommandArgs = ImageTweenArgs
    & { ease?: TweenCommandArgs['ease'], duration?: number }
    & ({ target: ImageTargetStage, inherit?: never } | { target: ImageTargetSprite | ImageTargetBackground, inherit?: false })

export const tween = DynamicMacro<ImageTweenCommandArgs>(
    ({ temp: { stage } }) =>
        function* ({ target: _target, inherit = true, ease, duration, alpha, ...args }) {
            if (alpha !== undefined) (args as Record<string, unknown>).autoAlpha = alpha
            const target = _target === 0
                ? stage.children.map((e) => e.internal.internal)
                : inherit
                    ? find(_target, stage)?.internal.internal.internal.internal
                    : find(_target, stage)?.internal.internal.internal.internal.children.slice(-1)[0]
            if (isUndefined(target)) return
            yield Tween.apply({ target, ease, duration, pixi: args })
        }
)

export type ImageFilterCommandArgs = { target: ImageTarget, filter: Filter }

export const filter = NonBlocking<ImageFilterCommandArgs>(
    ({ temp: { stage } }) =>
        ({ target: _target, filter }) => {
            const target = _target === 0 ? stage : find(_target, stage)?.internal.internal.internal.internal
            if (target) {
                if (target.filters) target.filters.push(filter)
                else target.filters = [filter]
            }
        }
)

export type ImageAnimationCommandArgs =
    { target: ImageTarget, type: AnimationTypes, duration: number }
    & ({ x: number, y?: number } | { x?: number, y: number })

const shake = (p: number) => (p === 0 || p === 1) ? 0 : random(p - 1, 1 - p)

const punch = (p: number) => (p === 0 || p === 1) ? 0 : Math.pow(2, -10 * p) * Math.sin((20 * Math.PI * p) / 3)

const AnimationPersets = { shake, punch } as const

export type AnimationTypes = keyof typeof AnimationPersets

export const animation = EffectScope(
    Dynamic<ImageAnimationCommandArgs>(
        ({ temp: { stage } }) =>
            function* ({ target: _target, type, x = 0, y = 0, duration }) {
                // 由于RenderLayer只渲染指定大小的范围,对舞台实现动画效果的方式是为所有元素都应用一个相同的动画
                const target = _target === 0
                    ? stage.children.map((e) => e.internal)
                    : find(_target, stage)?.internal.internal.internal
                if (isUndefined(target)) return
                yield new Promise((res) =>
                    gsap.to(target, {
                        pixi: { x, y },
                        ease: AnimationPersets[type],
                        duration: duration / 1000,
                        onComplete: res
                    })
                )
            }
    )
)
