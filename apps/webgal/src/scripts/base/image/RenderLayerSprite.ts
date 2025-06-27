import type { Container, IBaseTextureOptions, Renderer } from 'pixi.js'
import { RenderTexture, Sprite, Ticker } from 'pixi.js'

export class RenderLayerSprite<T extends Container> extends Sprite {
    declare readonly _texture: RenderTexture

    public label: unknown

    _renderer: Renderer | undefined

    get texture(): RenderTexture {
        return this._texture
    }
    set texture(value: RenderTexture) {
        super.texture = value
    }

    constructor(public internal: T, options: IBaseTextureOptions & { label?: unknown }) {
        super(RenderTexture.create(options))
        this.label = options.label
        const update = () => this._renderer?.render(this.internal, { renderTexture: this.texture, clear: true })
        this.on('added', () => Ticker.system.add(update))
        this.on('removed', () => Ticker.system.remove(update))
    }

    protected override _render(renderer: Renderer): void {
        this._renderer = renderer
        super._render(renderer)
    }
}
