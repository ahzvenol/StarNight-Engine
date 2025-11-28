import type { JSONObject, ModelSettings, Live2DFactoryOptions, Live2DModel as ILive2DModel } from '@/lib/pixi-live2d'
import { Container } from 'pixi.js'

const Live2DCubism2 = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'live2d.min.js'
    script.onload = () => resolve()
    script.onerror = () => reject()
    document.head.appendChild(script)
})
const Live2DCubism4 = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'live2dcubismcore.min.js'
    script.onload = () => resolve()
    script.onerror = () => reject()
    document.head.appendChild(script)
})

Live2DCubism2.catch(() => console.warn('Could not find Cubism 2 runtime.'))
Live2DCubism4.catch(() => console.warn('Could not find Cubism 4 runtime.'))

const Live2DModel = Promise.all([Live2DCubism2, Live2DCubism4])
    .then(() => import('@/lib/pixi-live2d'))
    .then((module) => module.Live2DModel)
    .catch(() => null)

type Cache = {
    motion: Parameters<ILive2DModel['motion']>,
    expression: Parameters<ILive2DModel['expression']>,
    speak: Parameters<ILive2DModel['speak']>,
    focus: Parameters<ILive2DModel['focus']>,
    blink: Parameters<ILive2DModel['internalModel']['setBlinkParam']>
}

export class LazyLive2DModel extends Container {
    public model: ILive2DModel | null = null

    protected cache: Map<keyof Cache, Cache[keyof Cache]> = new Map()

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
                // @ts-expect-error 类型...的参数不能赋给类型...的参数。
                this.cache = this.cache.forEach(([value, key]) => this[key](...value))
            })
    }

    public motion(...args: Cache['motion']): Promise<boolean> {
        if (this.model) {
            return this.model.motion(...args)
        }
        this.cache.set('motion', args)
        return Promise.resolve(false)
    }

    public expression(...args: Cache['expression']): Promise<boolean> {
        if (this.model) {
            return this.model.expression(...args)
        }
        this.cache.set('expression', args)
        return Promise.resolve(false)
    }

    public speak(...args: Cache['speak']): Promise<boolean> {
        if (this.model) {
            return this.model.speak(...args)
        }
        this.cache.set('speak', args)
        return Promise.resolve(false)
    }

    public focus(...args: Cache['focus']): void {
        if (this.model) {
            return this.model.focus(...args)
        }
        this.cache.set('focus', args)
    }

    public blink(...args: Cache['blink']): void {
        if (this.model) {
            return this.model.internalModel.setBlinkParam(...args)
        }
        this.cache.set('blink', { ...this.cache.get('blink') as Cache['blink'], ...args })
    }
}
