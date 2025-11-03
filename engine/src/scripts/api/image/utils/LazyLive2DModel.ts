import type { JSONObject, ModelSettings, Live2DFactoryOptions } from '@/lib/pixi-live2d'
import { Container } from 'pixi.js'
import { Live2DModel } from '@/lib/pixi-live2d'

type Cache = Partial<{
    motion: Parameters<Live2DModel['motion']>,
    expression: Parameters<Live2DModel['expression']>,
    speak: Parameters<Live2DModel['speak']>,
    focus: Parameters<Live2DModel['focus']>,
    blink: Parameters<Live2DModel['internalModel']['setBlinkParam']>
}>

export class LazyLive2DModel extends Container {
    public model: Live2DModel | null = null

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
        Live2DModel.from(this.source, this.options).then((model) => {
            this.model = model
            this.addChild(model)
            this.emit('loaded')
            if (this.cache.blink) this.blink(...this.cache.blink)
            // @ts-expect-error 类型...的参数不能赋给类型...的参数。
            this.order.forEach((key) => this[key](...this.cache[key]))
            ;(this.cache as unknown as null) = (this.order as unknown as null) = null
        })
    }

    public motion(...args: Parameters<Live2DModel['motion']>): Promise<boolean> {
        if (this.model) {
            return this.model.motion(...args)
        }
        this.updateCache('motion', args)
        return Promise.resolve(false)
    }

    public expression(...args: Parameters<Live2DModel['expression']>): Promise<boolean> {
        if (this.model) {
            return this.model.expression(...args)
        }
        this.updateCache('expression', args)
        return Promise.resolve(false)
    }

    public speak(...args: Parameters<Live2DModel['speak']>): Promise<boolean> {
        if (this.model) {
            return this.model.speak(...args)
        }
        this.updateCache('speak', args)
        return Promise.resolve(false)
    }

    public focus(...args: Parameters<Live2DModel['focus']>): void {
        if (this.model) {
            return this.model.focus(...args)
        }
        this.updateCache('focus', args)
    }

    public blink(...args: Parameters<Live2DModel['internalModel']['setBlinkParam']>): void {
        if (this.model) {
            return this.model.internalModel.setBlinkParam(...args)
        }
        this.cache.blink = { ...this.cache.blink, ...args }
    }
}
