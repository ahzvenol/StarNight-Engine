import type { Filter } from 'pixi.js'
import type { Except, MergeExclusive } from 'type-fest'
import type { TweenCommandArgs } from '../tween'
import { Dynamic, DynamicMacro, EffectScope, NonBlocking, StarNight } from '@starnight/core'
import { isString, isUndefined, random } from 'es-toolkit'
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'
import { Application, Container, Sprite, BlurFilter, ColorMatrixFilter, Transform } from 'pixi.js'
import { Tween } from '..'
import { MultiOffsetContainer } from './MultiOffsetContainer'
import { SideEffectLazySprite } from './SideEffectLazySprite'

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

type ImageStage = MultiOffsetContainer<MultiOffsetContainer<SideEffectLazySprite>>

export type ImageTargetStage = 0

export type ImageTargetSprite = string

export type ImageTarget = ImageTargetSprite | ImageTargetStage

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
    const container = new MultiOffsetContainer() as ImageStage
    container.pivot = { x: width / 2, y: height / 2 }
    temp.pixi = new Application({ view, width, height })
    temp.stage = temp.pixi.stage.addChild(container)
    // @ts-expect-error 类型...上不存在属性...
    globalThis['__PIXI_APP__'] = temp.pixi
})

StarNight.GameEvents.ready.subscribe(({ temp: { stage } }) => {
    stage.children.forEach((container) => {
        container.children.forEach((sprite) => sprite.load())
    })
})

// 在幕结束时清理,每个容器下只保留一个Sprite
StarNight.ActEvents.end.subscribe(({ temp: { stage } }) => {
    stage.children.forEach((container) => {
        container.children.slice(1).forEach((sprite) => sprite.destroy())
    })
})

export type ImageSetCommandArgs = { id: string, src: string, z?: number }

export const set = NonBlocking<ImageSetCommandArgs>(({ state, temp: { stage } }) => ({ id, src, z }) => {
    const container = stage.children.find((e) => e.name === id)
        || stage.addChild(new MultiOffsetContainer<SideEffectLazySprite>({ name: id }))
    const sprite = new SideEffectLazySprite(src)
    if (!isUndefined(z)) container.zIndex = z
    if (!state.isInitializing()) sprite.load()
    container.addChildAt(sprite, 0)
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

export type ImageTweenCommandArgs =
    Except<
        PixiPlugin.Vars,
        'zIndex' | 'positionX' | 'positionY' | 'resolution' | 'fillColor' | 'lineColor'
        | 'tilePosition' | 'tilePositionX' | 'tilePositionY' | 'tileScale' | 'tileScaleX' | 'tileScaleY' | 'tileX' | 'tileY'
    >
    & ({ target: ImageTargetStage, ease?: TweenCommandArgs['ease'], duration?: number }
        | { target: ImageTargetSprite, ease?: TweenCommandArgs['ease'], duration?: number, inherit?: boolean }
    )

export const tween = DynamicMacro<ImageTweenCommandArgs>(
    ({ temp: { stage } }) =>
        function* ({ target: _target, inherit = true, duration, ...args }) {
            const container = _target === 0 ? undefined : stage.children.find((e) => e.name === _target)
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

export type ImageAnimationEffectCommandArgs =
    { target: ImageTarget, preset: AnimationPresetEffectKeys, duration: number }
    & ({ x: number, y?: number } | { x?: number, y: number })

const shake = (p: number) => (p === 0 || p === 1) ? 0 : random(p - 1, 1 - p)

const punch = (p: number) => (p === 0 || p === 1) ? 0 : Math.pow(2, -10 * p) * Math.sin((20 * Math.PI * p) / 3)

const AnimationEffectPersets = { shake, punch } as const

export type AnimationPresetEffectKeys = keyof typeof AnimationEffectPersets

export const animation_effect = EffectScope(
    Dynamic<ImageAnimationEffectCommandArgs>(
        ({ temp: { stage } }) =>
            function* ({ target: _target, preset, x = 0, y = 0, duration }) {
                const target = _target === 0 ? stage : stage.children.find((e) => e.name === _target)
                if (isUndefined(target)) return
                yield new Promise((res) =>
                    gsap.to(target, {
                        x1: x, y1: y,
                        ease: AnimationEffectPersets[preset],
                        duration: duration / 1000,
                        onComplete: res
                    })
                )
            }
    )
)
