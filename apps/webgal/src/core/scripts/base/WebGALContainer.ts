import { Container } from 'pixi.js'

export class WebGALContainer extends Container {
    private _xi = 0
    private _yi = 0
    private _x0 = 0
    private _y0 = 0
    private _x1 = 0
    private _y1 = 0
    private _x2 = 0
    private _y2 = 0
    private _x3 = 0
    private _y3 = 0

    public get xi(): number {
        return this._xi
    }
    public set xi(v: number) {
        const i = this.x
        this._xi = v
        this.x = i
    }

    public get yi(): number {
        return this._yi
    }
    public set yi(v: number) {
        const i = this.y
        this._yi = v
        this.y = i
    }

    public get x0(): number {
        return this._x0
    }
    public set x0(v: number) {
        const i = this.x
        this._x0 = v
        this.x = i
    }

    public get y0(): number {
        return this._y0
    }
    public set y0(v: number) {
        const i = this.y
        this._y0 = v
        this.y = i
    }

    public get x1(): number {
        return this._x1
    }
    public set x1(v: number) {
        const i = this.x
        this._x1 = v
        this.x = i
    }

    public get y1(): number {
        return this._y1
    }
    public set y1(v: number) {
        const i = this.y
        this._y1 = v
        this.y = i
    }

    public get x2(): number {
        return this._x2
    }
    public set x2(v: number) {
        const i = this.x
        this._x2 = v
        this.x = i
    }

    public get y2(): number {
        return this._y2
    }
    public set y2(v: number) {
        const i = this.y
        this._y2 = v
        this.y = i
    }

    public get x3(): number {
        return this._x3
    }
    public set x3(v: number) {
        const i = this.x
        this._x3 = v
        this.x = i
    }

    public get y3(): number {
        return this._y3
    }
    public set y3(v: number) {
        const i = this.y
        this._y3 = v
        this.y = i
    }

    public override get x(): number {
        return (super.position?.x ?? 0) - (this._xi + this._x0 + this._x1 + this._x2 + this._x3)
    }
    public override set x(v: number) {
        if (super.position) super.position.x = v + this._xi + this._x0 + this._x1 + this._x2 + this._x3
    }

    public override get y(): number {
        return (super.position?.y ?? 0) - (this._yi + this._y0 + this._y1 + this._y2 + this._y3)
    }
    public override set y(v: number) {
        if (super.position) super.position.y = v + this._yi + this._y0 + this._y1 + this._y2 + this._y3
    }

    public override set width(v: number) {
        this.xi = this.pivot.x * this.width / this.scale.x
    }
    public override set height(v: number) {
        this.yi = this.pivot.y * this.height / this.scale.y
    }
}
