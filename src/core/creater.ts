import createjs from "createjs-npm"

class Tween {
    static tweenList: Array<createjs.Tween> = []
    static get(target: any, props?: createjs.TweenProps | undefined) {
        const tween = createjs.Tween.get(target, props)
        this.tweenList.push(tween)
        return tween
    }
    static immedExec() {
        this.tweenList.forEach(tween => tween.setPosition(tween.duration))
        this.tweenList.clear()
    }
}

class Container extends createjs.Container {

}

export { Tween, Container }
