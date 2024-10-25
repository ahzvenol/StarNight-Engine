import { CommandLifeCycleFunction, CommandRunFunction, State } from '@/core/Command'
import { Y } from '@/utils/FPUtil'
import { range } from 'es-toolkit'
import { match, P } from 'ts-pattern'
import { TweenCommandArgs } from './tween'

type SetImageCommandArgs = {
    name: string
    file: string
    x?: number
    y?: number
    z?: number
    w?: number
    h?: number
}
// 跨幕环境变量file,需要收集副作用

// 为了让addChildAt正常工作,预先添加一些空容器
const beforeInit: CommandLifeCycleFunction = ({ stage }) =>
    range(0, 100)
        .map(() => new createjs.Container())
        .forEach((c) => stage.addChild(c))

const afterInit: CommandLifeCycleFunction = ({ stage }) =>
    Y<createjs.DisplayObject, void>(
        (rec) => (displayObject) =>
            match(displayObject)
                .with(P.instanceOf(createjs.Container), (container) => container.children.forEach(rec))
                .with(P.instanceOf(createjs.Bitmap), (bitmap) =>
                    match(bitmap.image)
                        .with(P.instanceOf(Image), (image) => (image.src = image.meta))
                        .otherwise(() => {})
                )
    )(stage)

// z,w,h可选,若不设定则默认在最上层,保持图片原宽高
const setImage: CommandRunFunction<SetImageCommandArgs> =
    ({
        state,
        stage
        // save: {
        //     global: { cg }
        // }
    }) =>
    ({ name, file, x = 0, y = 0, z = 1, w, h }) => {
        // if (!cg().includes(file)) cg().push(file)
        const container = (stage.getChildByName(name) as createjs.Container) || new createjs.Container()
        if (state === State.Init) {
            const image = new Image()
            image.meta = file
            const bitmap = new createjs.Bitmap(image)
            container.addChild(bitmap)
        } else {
            const bitmap = new createjs.Bitmap(file)
            container.addChild(bitmap)
        }
        container.name = name
        container.x = x
        container.y = y
        console.log(x, y)

        stage.addChildAt(container, z)
    }

export const SetImage = { beforeInit, init: setImage, afterInit, run: setImage }

type MoveImageCommandArgs = {
    target: string
} & TweenCommandArgs

const moveImage: CommandRunFunction<MoveImageCommandArgs> =
    ({
        state,
        stage
        // save: {
        //     global: { cg }
        // }
    }) =>
    ({ name, file, x = 0, y = 0, z = 1, w, h }) => {
        // if (!cg().includes(file)) cg().push(file)
        const container = new createjs.Container()
        if (state === State.Init) {
            const image = new Image()
            image.meta = file
            const bitmap = new createjs.Bitmap(image)
            container.addChild(bitmap)
        } else {
            const bitmap = new createjs.Bitmap(file)
            container.addChild(bitmap)
        }
        container.name = name
        container.x = x
        container.y = y
        stage.addChildAt(container, z)
    }

// x, y,w, h,duration,transition可选,若不设定则保持原参数
// const move =
//     (context) =>
//     ({ target, x, y, w, h, duration, transition }) => {}

// //如果图片已经移动到视图外的话,其实清除与否是无所谓的事情了
// const clear =
//     (context) =>
//     ({ target }) => {}

// export { set, move, clear }
