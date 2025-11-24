/* eslint-disable @stylistic/multiline-ternary */
import type { DisplayObject, Filter } from 'pixi.js'
import type { MergeExclusive } from 'type-fest'
import type { GameTempData } from '@starnight/core'
import type { TransformBlock } from '../tween'
import { DynamicMacro, NonBlocking, StarNight } from '@starnight/core'
import { isFunction, isString, isUndefined, negate } from 'es-toolkit'
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'
import { Application, Container, Sprite, BlurFilter, ColorMatrixFilter, Transform, INSTALLED } from 'pixi.js'
import { Tween } from '..'
import { NestedContainer } from './utils/NestedContainer'
import { RenderLayerContainer } from './utils/RenderLayerContainer'
import { GifResource } from './utils/GifResource'
import { LazySprite } from './utils/LazySprite'
import { LazyLive2DModel } from './utils/LazyLive2DModel'

gsap.registerPlugin(PixiPlugin)
PixiPlugin.registerPIXI({ Container, Sprite, BlurFilter, ColorMatrixFilter })

// 通过GifResource支持.gif格式
INSTALLED.push(GifResource)

// 增强getChildAt函数,使其支持负数索引
declare module 'pixi.js' {
    interface Container<T extends DisplayObject = DisplayObject> {
        getChildAt(index: number): T | undefined
    }
}
Container.prototype.getChildAt = function (index: number) {
    return this.children.at(index)
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

// Image命令的作用目标包括（0:舞台,1:背景,string:立绘）,为了避免ts显示类型别名,参数处都直接写明具体类型
// Container即Stage,RenderLayerContainer为图层容器,NestedContainer为转场容器
type ImageStage = Container<RenderLayerContainer<NestedContainer<LazySprite | LazyLive2DModel>>>

declare module '@starnight/core' {
    interface GameLocalData {
        iclearpoint?: number
    }
    interface GameUIExternalData {
        view: HTMLCanvasElement
    }
    interface GameTempData {
        pixi: Application<HTMLCanvasElement>
        stage: ImageStage & { map: Map<1 | string, ImageStage['children'][number]> }
    }
}

StarNight.GameEvents.setup.subscribe(({ ui: { view }, temp }) => {
    const { width, height } = view
    temp.pixi = new Application({ view, width, height })
    temp.stage = temp.pixi.stage as GameTempData['stage']
    temp.stage.map = new Map()
    temp.stage.sortableChildren = true
    temp.stage.pivot = { x: width / 2, y: height / 2 }
    // @ts-expect-error 类型...上不存在属性...
    globalThis['__PIXI_APP__'] = temp.pixi
})

StarNight.GameEvents.ready.subscribe(({ temp: { stage } }) => {
    stage.children.forEach((layer) => layer.children.forEach((container) => container.internal.load()))
})

export type TransitionFunction = Function1<
    { before?: Container, after?: Container },
    { before: TransformBlock, after: TransformBlock }
>

export type ImageSetCommandArgs = {
    target: 1 | string, src: string | null, z?: number, transition?: TransitionFunction
}

function handleLoaded(app: Application, sprite: Sprite | LazyLive2DModel) {
    if (sprite.destroyed) return
    if (sprite instanceof LazyLive2DModel) {
        const model = sprite.model!
        model!.scale.set(Math.min(app.screen.width / model.width, app.screen.height / model.height))
    }
    const { x, y } = sprite instanceof LazyLive2DModel
        ? { x: sprite.width / 2, y: sprite.height / 2 }
        : { x: sprite.texture.orig.width / 2, y: sprite.texture.orig.height / 2 }
    sprite.pivot = { x, y }
    if (!sprite.parent) return
    sprite.parent.pivot = { x, y }
    if (!sprite.parent.parent) return
    sprite.parent.parent.pivot = { x, y }
}

export const set = DynamicMacro<ImageSetCommandArgs>(
    ({ state, current, local: { iclearpoint }, temp: { pixi, stage } }) =>
        function* ({ target, src, z, transition }) {
            if (isString(target) && iclearpoint && current.count() < iclearpoint) return
            const layer = stage.map.get(target)
                ?? stage.addChild(new RenderLayerContainer<NestedContainer<LazySprite>>())
            // z这个属性是特殊的,因为它只能设置在顶层容器上,否则不起作用
            layer.zIndex = z ?? layer.zIndex
            // 当src显式设置为null,就将layer从map中移除,此时并未实际移除该layer,但不会再查询到它
            stage.map[src === null ? 'delete' : 'set'](target, layer)
            const before = layer.getChildAt(-1)
            const after = src === null ? undefined : src?.endsWith('.json')
                ? layer.addChild(new NestedContainer(new LazyLive2DModel(src)))
                : layer.addChild(new NestedContainer(new LazySprite(src, { resourceOptions: { muted: true } })))
            after?.once('loaded', () => handleLoaded(pixi, after.internal))
            if (!state.isInitializing()) {
                after?.internal.load()
                // 为了正确的混合,转场滤镜运行在外层,为了避免影响用户层,转场滤镜使用独立容器
                if (transition) {
                    const trans = transition({ before, after })
                    yield Promise.all([
                        before && (yield Tween.apply({ target: before, transform: trans.before })),
                        after && (yield Tween.apply({ target: after, transform: trans.after }))
                    ])
                }
            }
            // close相对于set的唯一特殊之处就是移除并销毁layer
            (after ? before : layer)?.destroy()
        }
)

export type ImageCloseCommandArgs = MergeExclusive<
    { target: (1 | string) | Array<(1 | string)> },
    { exclude?: (1 | string) | Array<(1 | string)> }
> & { transition?: TransitionFunction }

export const close = DynamicMacro<ImageCloseCommandArgs>(
    ({ current, temp: { stage } }) =>
        function* ({ target: _target, exclude: _exclude, transition }) {
            const _targets: Set<1 | string> =
                Array.isArray(_target) ? new Set(_target) : isUndefined(_target) ? new Set() : new Set([_target])
            const _excludes: Set<1 | string> =
                Array.isArray(_exclude) ? new Set(_exclude) : isUndefined(_exclude) ? new Set() : new Set([_exclude])
            const layers = [...stage.map.keys()]
            const targets = _targets.size > 0 ? layers.filter(_targets.has) : layers.filter(negate(_excludes.has))
            const isEmptyStage = (targets.length - stage.children.length) === 0
            const isOnlyBackground = (targets.length - stage.children.length) === 1 && !targets.includes(1)
            if (isEmptyStage || isOnlyBackground) current.iclearpoint(current.count())
            for (const target of targets) yield set({ target: target, src: null, transition })
        }
)

export type ImageTweenTarget =
({ target: 0, inherit?: never } | { target: 1 | string, inherit?: boolean })

export type ImageTweenCommandArgs = ImageTweenTarget & { transform: TransformBlock }

export const tween = DynamicMacro<ImageTweenCommandArgs>(
    ({ current, local: { iclearpoint }, temp: { stage } }) =>
        function* ({ target: _target, inherit: _inherit, transform }) {
            if (isString(_target) && iclearpoint && current.count() < iclearpoint) return
            const inherit = _inherit ?? _target === 1 ? false : true
            const target = _target === 0 ? stage : inherit
                ? stage.map.get(_target)
                : stage.map.get(_target)?.getChildAt(-1)?.internal
            if (isUndefined(target)) return
            yield Tween.apply({ target, transform })
        }
)

export type ImageFilterCommandArgs =
ImageTweenTarget & { filters: Array<Filter> | ((filters: Array<Filter> | null) => Array<Filter> | null) | null }

export const filters = NonBlocking<ImageFilterCommandArgs>(
    ({ current, local: { iclearpoint }, temp: { stage } }) =>
        ({ target: _target, inherit = true, filters }) => {
            if (isString(_target) && iclearpoint && current.count() < iclearpoint) return
            const target = _target === 0 ? stage : inherit
                ? stage.map.get(_target)
                : stage.map.get(_target)?.getChildAt(-1)?.internal
            if (target) {
                if (isFunction(filters)) {
                    target.filters = filters(target.filters) as Array<Filter>
                } else target.filters = filters as Array<Filter> | null
            }
        }
)
