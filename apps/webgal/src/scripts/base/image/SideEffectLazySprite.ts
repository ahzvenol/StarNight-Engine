import type { ImageResource } from 'pixi.js'
import { Sprite, Texture } from 'pixi.js'

export class SideEffectLazySprite extends Sprite {
    constructor(private src: string) { super() }

    public load = () => {
        this.texture = Texture.from(this.src)
        const handleLoaded = () => {
            this.pivot = { x: this.texture.orig.width / 2, y: this.texture.orig.height / 2 }
            if (this.parent) {
                this.parent.pivot = { x: this.texture.orig.width / 2, y: this.texture.orig.height / 2 }
            }
        }
        if (this.texture.baseTexture.valid) handleLoaded()
        else this.texture.baseTexture.once('loaded', handleLoaded)
        const resource = this.texture.baseTexture.resource as ImageResource
        if (resource.source instanceof HTMLVideoElement) resource.source.muted = true
    }
}
