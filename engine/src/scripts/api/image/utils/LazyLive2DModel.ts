import type { JSONObject, ModelSettings, Live2DFactoryOptions, Live2DModel as ILive2DModel } from '@/lib/pixi-live2d'
import { Container } from 'pixi.js'

const Live2DCubism2 = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'live2d.min1.js'
    script.onload = () => resolve()
    script.onerror = () => reject(console.warn('Could not find Cubism 4 runtime.'))
    document.head.appendChild(script)
})
const Live2DCubism4 = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'live2dcubismcore.min.js'
    script.onload = () => resolve()
    script.onerror = () => reject(console.warn('Could not find Cubism 4 runtime.'))
    document.head.appendChild(script)
})

const Live2DModel = Promise.all([Live2DCubism2, Live2DCubism4])
    .then(() => import('@/lib/pixi-live2d'))
    .then((module) => module.Live2DModel)
    .catch(() => null)

type Cache = Partial<{
    motion: Parameters<ILive2DModel['motion']>,
    expression: Parameters<ILive2DModel['expression']>,
    speak: Parameters<ILive2DModel['speak']>,
    focus: Parameters<ILive2DModel['focus']>,
    blink: Parameters<ILive2DModel['internalModel']['setBlinkParam']>
}>

export class LazyLive2DModel extends Container {
    public model: ILive2DModel | null = null

    protected cache: Cache = {}
    protected order: Set<keyof Cache> = new Set()

    protected updateCache<K extends keyof Cache>(key: K, args: Cache[K]): void {
        if (this.order.has(key)) {
            this.order.delete(key)
        }
        this.order.add(key)
        this.cache[key] = args
    }

    public constructor(
        public readonly source: string | JSONObject | ModelSettings,
        public readonly options?: Live2DFactoryOptions
    ) {
        super()
    }

    public load() {
        Live2DModel
            .then((Live2DModel) => Live2DModel?.from(this.source, this.options))
            .then((model) => {
                if (!model) return
                this.model = model
                this.addChild(model)
                this.emit('loaded')
                if (this.cache.blink) this.blink(...this.cache.blink)
                // @ts-expect-error 类型...的参数不能赋给类型...的参数。
                this.order.forEach((key) => this[key](...this.cache[key]))
                this.cache = this.order = null!
            })
    }

    public motion(...args: Parameters<ILive2DModel['motion']>): Promise<boolean> {
        if (this.model) {
            return this.model.motion(...args)
        }
        this.updateCache('motion', args)
        return Promise.resolve(false)
    }

    public expression(...args: Parameters<ILive2DModel['expression']>): Promise<boolean> {
        if (this.model) {
            return this.model.expression(...args)
        }
        this.updateCache('expression', args)
        return Promise.resolve(false)
    }

    public speak(...args: Parameters<ILive2DModel['speak']>): Promise<boolean> {
        if (this.model) {
            return this.model.speak(...args)
        }
        this.updateCache('speak', args)
        return Promise.resolve(false)
    }

    public focus(...args: Parameters<ILive2DModel['focus']>): void {
        if (this.model) {
            return this.model.focus(...args)
        }
        this.updateCache('focus', args)
    }

    public blink(...args: Parameters<ILive2DModel['internalModel']['setBlinkParam']>): void {
        if (this.model) {
            return this.model.internalModel.setBlinkParam(...args)
        }
        this.cache.blink = { ...this.cache.blink, ...args }
    }
}
