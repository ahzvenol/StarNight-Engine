import type { DisplayObject, MaskData, Renderer } from 'pixi.js'
import { AlphaFilter, Container } from 'pixi.js'

const RENDER_LAYER_FILTERS = [new AlphaFilter()]

export class RenderLayerContainer<T extends DisplayObject = DisplayObject> extends Container<T> {
    constructor(options?: { name?: NonNullable<unknown> }) {
        super()
        if (options?.name) this.name = options.name
    }

    override render(renderer: Renderer): void {
        // if the object is not visible or the alpha is 0 then no need to render this element
        if (!this.visible || this.worldAlpha <= 0 || !this.renderable) {
            return
        }

        this.renderAdvanced(renderer)
    }

    protected override renderAdvanced(renderer: Renderer): void {
        const filters = this.filters?.length ? RENDER_LAYER_FILTERS : this.filters!

        const mask = this._mask as MaskData

        if (!this._enabledFilters) {
            this._enabledFilters = []
        }

        this._enabledFilters.length = 0

        for (let i = 0; i < filters.length; i++) {
            if (filters[i].enabled) {
                this._enabledFilters.push(filters[i])
            }
        }

        renderer.batch.flush()

        renderer.filter.push(this, this._enabledFilters)

        if (mask) {
            renderer.mask.push(this, this._mask)
        }

        if (this.cullable) {
            this._renderWithCulling(renderer)
        } else {
            this._render(renderer)

            for (let i = 0, j = this.children.length; i < j; ++i) {
                this.children[i].render(renderer)
            }
        }

        renderer.batch.flush()

        if (mask) {
            renderer.mask.pop(this)
        }

        renderer.filter.pop()
    }
}
