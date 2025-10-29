import type { Texture } from 'pixi.js'
import { Filter } from 'pixi.js'
import vertex from './default_program_300.vert'
import fragment from './image_dissolve_300.frag'

export type ImageDissolveFilterOptions = { progress?: number, ramplen?: number, reverse?: boolean }

export class ImageDissolveFilter extends Filter {
    constructor(uTexture: Texture, options: ImageDissolveFilterOptions = {}) {
        const { progress = 0, ramplen = 8, reverse = false } = options

        super(vertex, fragment, { uTexture, progress, ramplen, reverse })
    }
}
