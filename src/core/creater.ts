import createjs from "createjs-npm"
import { Reactive } from "micro-reactive"
import { State } from "./state"
import { Timer } from "./Timer"
// todo:目的是让用户没有负担的使用这些函数,也就是说,不应该让用户做任何多余的判断
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
