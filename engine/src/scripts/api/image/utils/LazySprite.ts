import type { IBaseTextureOptions } from 'pixi.js'
import { Sprite, Texture } from 'pixi.js'

export class LazySprite extends Sprite {
    constructor(public readonly src: string, public readonly options?: IBaseTextureOptions) { super() }

    public load() {
        this.texture = Texture.from(this.src, this.options)
        if (this.texture.baseTexture.valid) this.emit('loaded')
        else this.texture.baseTexture.once('loaded', () => this.emit('loaded'))
    }
}
