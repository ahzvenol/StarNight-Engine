import type { DisplayObject } from 'pixi.js'
import { Container } from 'pixi.js'

export class LabelContainer<T extends DisplayObject> extends Container<T> {
    constructor(public label: unknown) { super() }
}
