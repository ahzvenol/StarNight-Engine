import type { Filter, BaseImageResource } from 'pixi.js'
import type { MergeExclusive } from 'type-fest'
import type { TransformBlock } from '../tween'
import { DynamicMacro, NonBlocking, StarNight } from '@starnight/core'
import { isFunction, isString, isUndefined, negate } from 'es-toolkit'
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'
import { Application, Container, Sprite, BlurFilter, ColorMatrixFilter, Transform, Texture, INSTALLED } from 'pixi.js'
import { Tween } from '..'
import { NestedContainer } from './NestedContainer'
import { RenderLayerContainer } from './RenderLayerContainer'
import { SrcSprite } from './SrcSprite'
import { GifResource } from './GifResource'

gsap.registerPlugin(PixiPlugin)
PixiPlugin.registerPIXI({ Container, Sprite, BlurFilter, ColorMatrixFilter })

// 扩大DisplayObject-name属性的适用类型
// 修复Container-getChildByName方法的泛型
declare module 'pixi.js' {
    interface DisplayObject {
        name: ImageTargetStageChildren | undefined
    }
    interface Container<T extends DisplayObject = DisplayObject> {
        getChildByName(name: NonNullable<ImageTargetStageChildren>): T | null
    }
}

// 通过GifResource支持.gif格式
INSTALLED.push(GifResource)

// 增强getChildAt函数,使其支持负数索引
Container.prototype.getChildAt = function (index: number) {
    const res = this.children.at(index)
    if (res !== undefined) return res
    else throw new Error(`getChildAt: Index (${index}) does not exist.`)
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

type ImageStage = Container<RenderLayerContainer<NestedContainer<SrcSprite>>>

export type ImageTargetStage = 0

export type ImageTargetBackground = 1

export type ImageTargetSprite = string

export type ImageTargetStageChildren = ImageTargetBackground | ImageTargetSprite

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
    const resource = sprite.texture.baseTexture.resource as BaseImageResource
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
    stage.children.forEach((layer) => layer.children.forEach((container) => initializeSprite(container.internal)))
})

export type TransitionFunction = Function1<
    { before?: Container, after?: Container },
    { before: TransformBlock, after: TransformBlock }
>

export type ImageSetCommandArgs = {
    target: ImageTargetStageChildren, src: string | null, z?: number, transition?: TransitionFunction
}

export const set = DynamicMacro<ImageSetCommandArgs>(
    ({ state, current, local: { iclearpoint }, temp: { stage } }) =>
        function* ({ target, src, z, transition }) {
            if (isString(target) && iclearpoint && current.count() < iclearpoint) return
            const layer = stage.getChildByName(target)
                ?? stage.addChild(new RenderLayerContainer<NestedContainer<SrcSprite>>({ name: target }))
            const before = layer.getChildAt(-1)
            const after = src ? layer.addChild(new NestedContainer<SrcSprite>(new SrcSprite(src))) : undefined
            // z这个属性是特殊的,因为它只能设置在layer上
            if (!isUndefined(z)) layer.zIndex = z
            // 当src显式设置为null,就从stage中移除layer
            if (!after) layer.name = undefined
            else if (!state.isInitializing()) initializeSprite(after.internal)
            // 转场效果运行在独立的一层上,避免影响用户层
            // 为了正确的混合,转场滤镜作为滤镜的最后一个或应用在容器的外层
            if (transition) {
                const trans = transition({ before, after })
                yield Promise.all([
                    before && (yield Tween.apply({ target: before, transform: trans.before })),
                    after && (yield Tween.apply({ target: after, transform: trans.after }))
                ])
            }
            // close相对于set的唯一特殊之处就是移除并销毁layer
            (after ? before : layer)?.destroy()
        }
)

export type ImageCloseCommandArgs = MergeExclusive<
    { target: ImageTargetStageChildren | Array<ImageTargetStageChildren> },
    { exclude?: ImageTargetStageChildren | Array<ImageTargetStageChildren> }
> & { transition?: TransitionFunction }

export const close = DynamicMacro<ImageCloseCommandArgs>(
    ({ current, temp: { stage } }) =>
        function* ({ target: _target, exclude: _exclude, transition }) {
            const _targets: Set<ImageTargetStageChildren> =
                Array.isArray(_target) ? new Set(_target) : isUndefined(_target) ? new Set() : new Set([_target])
            const _excludes: Set<ImageTargetStageChildren> =
                Array.isArray(_exclude) ? new Set(_exclude) : isUndefined(_exclude) ? new Set() : new Set([_exclude])
            const layers = stage.children.map((layer) => layer.name!)
            const targets: Array<ImageTargetStageChildren> =
                _targets.size > 0 ? layers.filter(_targets.has) : layers.filter(negate(_excludes.has))
            const isEmptyStage = (targets.length - stage.children.length) === 0
            const isOnlyBackground = (targets.length - stage.children.length) === 1 && !targets.includes(1)
            if (isEmptyStage || isOnlyBackground) current.iclearpoint(current.count())
            for (const target of targets) yield set({ target: target, src: null, transition })
        }
)

export type ImageTweenTarget =
({ target: ImageTargetStage, inherit?: never } | { target: ImageTargetStageChildren, inherit?: false })

export type ImageTweenCommandArgs = ImageTweenTarget & { transform: TransformBlock }

export const tween = DynamicMacro<ImageTweenCommandArgs>(
    ({ current, local: { iclearpoint }, temp: { stage } }) =>
        function* ({ target: _target, inherit = true, transform }) {
            if (isString(_target) && iclearpoint && current.count() < iclearpoint) return
            // eslint-disable-next-line @stylistic/multiline-ternary
            const target = _target === 0 ? stage : inherit
                ? stage.getChildByName(_target)
                : stage.getChildByName(_target)?.getChildAt(-1).internal
            if (isUndefined(target)) return
            yield Tween.apply({ target, transform })
        }
)

export type SetFilterFunction = (filters: Array<Filter> | null) => Array<Filter> | null

export type ImageFilterCommandArgs = ImageTweenTarget & { filters: Array<Filter> | SetFilterFunction | null }

export const filters = NonBlocking<ImageFilterCommandArgs>(
    ({ current, local: { iclearpoint }, temp: { stage } }) =>
        ({ target: _target, inherit = true, filters }) => {
            if (isString(_target) && iclearpoint && current.count() < iclearpoint) return
            // eslint-disable-next-line @stylistic/multiline-ternary
            const target = _target === 0 ? stage : inherit
                ? stage.getChildByName(_target)
                : stage.getChildByName(_target)?.getChildAt(-1).internal
            if (target) {
                if (isFunction(filters)) {
                    target.filters = (filters as SetFilterFunction)(target.filters)
                } else target.filters = filters as Array<Filter> | null
            }
        }
)
