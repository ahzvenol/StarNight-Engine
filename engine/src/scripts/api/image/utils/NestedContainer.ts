import type { DisplayObject } from 'pixi.js'
import { Container } from 'pixi.js'

export class NestedContainer<T extends DisplayObject> extends Container<T> {
    public declare readonly children: [T]

    public constructor(public internal: T) {
        super()
        super.addChild(internal)
    }
}
