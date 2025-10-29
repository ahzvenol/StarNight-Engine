import type { Filter, ImageResource } from 'pixi.js'
import type { Except, MergeExclusive } from 'type-fest'
import type { TweenCommandArgs } from '../tween'
import { Dynamic, DynamicBlocking, DynamicMacro, EffectScope, NonBlocking, StarNight } from '@starnight/core'
import { assert, isUndefined, omit, random } from 'es-toolkit'
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'
import { Application, Container, Sprite, BlurFilter, ColorMatrixFilter, Transform, Texture, BLEND_MODES } from 'pixi.js'
import { apply, TransformArgType } from '../tween copy'
import { RenderLayerContainer } from './RenderLayerContainer'
import { RenderLayerSprite } from './RenderLayerSprite'
import { SrcSprite } from './SrcSprite'
import { NestedContainer } from './NestedContainer'

gsap.registerPlugin(PixiPlugin)
PixiPlugin.registerPIXI({ Container, Sprite, BlurFilter, ColorMatrixFilter })

// 扩大DisplayObject-name属性的适用类型
// 修复Container-getChildByName方法的泛型
declare module 'pixi.js' {
    interface DisplayObject {
        name: unknown
    }
    interface Container<T extends DisplayObject = DisplayObject> {
        getChildByName(name: NonNullable<unknown>): T | null
    }
}

// 修正PIXI锚点逻辑,使其不影响精灵位置
Transform.prototype.updateLocalTransform = function (): void {
    const lt = this.localTransform

    if (this._localID !== this._currentLocalID) {
        lt.a = this._cx * this.scale.x
        lt.b = this._sx * this.scale.x
        lt.c = this._cy * this.scale.y
        lt.d = this._sy * this.scale.y

        lt.tx = this.position.x + this.pivot.x - (this.pivot.x * lt.a + this.pivot.y * lt.c)
        lt.ty = this.position.y + this.pivot.y - (this.pivot.x * lt.b + this.pivot.y * lt.d)
        this._currentLocalID = this._localID

        this._parentID = -1
    }
}
Transform.prototype.updateTransform = function (parentTransform: Transform): void {
    const lt = this.localTransform

    if (this._localID !== this._currentLocalID) {
        lt.a = this._cx * this.scale.x
        lt.b = this._sx * this.scale.x
        lt.c = this._cy * this.scale.y
        lt.d = this._sy * this.scale.y

        lt.tx = this.position.x + this.pivot.x - (this.pivot.x * lt.a + this.pivot.y * lt.c)
        lt.ty = this.position.y + this.pivot.y - (this.pivot.x * lt.b + this.pivot.y * lt.d)
        this._currentLocalID = this._localID

        this._parentID = -1
    }

    if (this._parentID !== parentTransform._worldID) {
        const pt = parentTransform.worldTransform
        const wt = this.worldTransform

        wt.a = lt.a * pt.a + lt.b * pt.c
        wt.b = lt.a * pt.b + lt.b * pt.d
        wt.c = lt.c * pt.a + lt.d * pt.c
        wt.d = lt.c * pt.b + lt.d * pt.d
        wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx
        wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty

        this._parentID = parentTransform._worldID

        this._worldID++
    }
}

type ImageStage = Container<RenderLayerContainer<SrcSprite>>

export type ImageTargetStage = 0

export type ImageTargetBackground = 1

export type ImageTargetSprite = string

export type ImageTarget = ImageTargetSprite | ImageTargetBackground | ImageTargetStage

declare module '@starnight/core' {
    interface GameLocalData {
        iclearpoint?: number
    }
    interface GameUIExternalData {
        view: HTMLCanvasElement
    }
    interface GameTempData {
        pixi: Application<HTMLCanvasElement>
        stage: ImageStage
    }
}

/** 加载精灵纹理,设置变换锚点到精灵及其父容器中心 */
function initializeSprite(sprite: SrcSprite) {
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

StarNight.GameEvents.setup.subscribe(({ ui: { view }, temp }) => {
    const { width, height } = view
    temp.pixi = new Application({ view, width, height })
    temp.stage = temp.pixi.stage as ImageStage
    temp.stage.sortableChildren = true
    temp.stage.pivot = { x: width / 2, y: height / 2 }
    // @ts-expect-error 类型...上不存在属性...
    globalThis['__PIXI_APP__'] = temp.pixi
})

StarNight.GameEvents.ready.subscribe(({ temp: { stage } }) => {
    stage.children.forEach((layer) => layer.children.forEach(initializeSprite))
})

type TransitionFunction = Function1<
    { before?: Container, after?: Container },
    { before: TransformArgType, after: TransformArgType }
>

export type ImageSetCommandArgs =
    { id: ImageTargetSprite | ImageTargetBackground, src?: string, z?: number }
    & { inherit?: boolean, transition?: TransitionFunction, transform?: TransformArgType, filters?: Array<Filter> }

export const set = DynamicBlocking<ImageSetCommandArgs>(
    (context) =>
        function* ({ id, src, z, inherit, transition, transform, filters = null }) {
            const { state, temp: { stage } } = context
            const layer = stage.getChildByName(id)
                ?? stage.addChild(new RenderLayerContainer<SrcSprite>({ name: id }))
            const before = layer.children.at(-1)
            const after = src ? layer.addChild(new SrcSprite(src)) : undefined
            if (!isUndefined(z)) layer.zIndex = z
            if (!state.isInitializing() && after) initializeSprite(after)
            if (inherit) layer.filters = filters
            else if (after) after.filters = filters
            if (transform && after) yield apply({ target: after, transform: transform })(context)
            if (transition) {
                const trans = transition({ before, after })
                if (before) yield apply({ target: before, transform: trans.before })(context)
                if (after) yield apply({ target: after, transform: trans.after })(context)
            }
        }
)

// export type ImageCloseCommandArgs = MergeExclusive<
//     { target: ImageTargetSprite | ImageTargetBackground | Array<ImageTargetSprite | ImageTargetBackground> },
//     { exclude?: ImageTargetSprite | ImageTargetBackground | Array<ImageTargetSprite | ImageTargetBackground> }
// > & { duration?: number }

// export const close = DynamicMacro<ImageCloseCommandArgs>(
//     ({ current, temp: { stage } }) =>
//         function* ({ target: _target, exclude: _exclude, duration }) {
//             const _targets: Array<unknown> = Array.isArray(_target) ? _target : isUndefined(_target) ? [] : [_target]
//             const _excludes: Array<unknown> = Array.isArray(_exclude) ? _exclude : isUndefined(_exclude) ? [] : [_exclude]
//             const targets = stage.children
//                 .filter((layer) => _targets.length > 0
//                     ? _targets.includes(layer.name)
//                     : !_excludes.includes(layer.name)
//                 )
//             targets.forEach((layer) => layer.name = null)
//             if (duration) yield (yield Tween.apply({ target: targets, duration, pixi: { alpha: 0 } }))
//             targets.forEach((layer) => layer.destroy())
//             const isStageEmpty = stage.children.length === 0
//             const isOnlyBackground = stage.children.length === 1 && stage.children[0].name === 1
//             if (isStageEmpty || isOnlyBackground) current.iclearpoint(current.count())
//         }
// )

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

export type ImageTweenTarget =
({ target: ImageTargetStage, inherit?: never } | { target: ImageTargetSprite | ImageTargetBackground, inherit?: false })

export type ImageTweenCommandArgs = ImageTweenArgs & ImageTweenTarget
    & { ease?: TweenCommandArgs['ease'], duration?: number, repeat?: number, yoyo?: boolean }

export const tween = DynamicMacro<ImageTweenCommandArgs>(
    ({ temp: { stage } }) =>
        function* ({ inherit = true, target: _target, ease, duration, repeat, yoyo, ...args }) {
            const target = _target === 0
                ? stage
                : inherit
                    ? stage.getChildByName(_target)
                    : stage.getChildByName(_target)?.children.slice(-1)[0]
            if (isUndefined(target)) return
            yield Tween.apply({ target, ease, duration, repeat, yoyo, pixi: args })
        }
)
