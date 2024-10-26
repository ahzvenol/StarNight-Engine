import { CommandLifeCycleFunction, CommandRunFunction, State } from '@/core/Command'
import { Y } from '@/utils/FPUtil'
import { range } from 'es-toolkit'
import { match, P } from 'ts-pattern'
import { Tween } from './tween'

type SetImageCommandArgs = {
    name: string
    file: string
    ease?: string
    duration: number
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
                .with(P.instanceOf(createjs.Bitmap), (bitmap) => {
                    if (bitmap.image.tagName === 'image') {
                        const container = bitmap.parent
                        container.removeChild(bitmap)
                        container.addChild(new createjs.Bitmap(bitmap.image.getAttribute('meta')!))
                    }
                })
                .otherwise((container) => {
                    // @ts-expect-error 类型识别异常
                    if (container.children !== undefined) container.children.forEach(rec)
                })
    )(stage)

// z,w,h可选,若不设定则默认在最上层,保持图片原宽高
const setImage: CommandRunFunction<SetImageCommandArgs> =
    (context) =>
    async ({ name, file, ease, duration, x = 0, y = 0, z = 1, w, h }) => {
        const { state, stage, save } = context
        // if (!cg().includes(file)) cg().push(file)
        const container = (stage.getChildByName(name) as createjs.Container) || new createjs.Container()
        if (container.name === null) container.name = name
        const bitmap = match(state)
            // @ts-expect-error 类型与属性识别异常
            .with(State.Init, () => new createjs.Bitmap(<image attr:meta={file} />))
            .otherwise(() => new createjs.Bitmap(file))
        container.addChildAt(bitmap, 0)
        // fix:修改同name下图片时的xy继承与覆盖问题
        container.x = x
        container.y = y
        stage.addChild(container)
        stage.setChildIndex(container, z)
        await Tween.run(context)({ target: container.getChildAt(1), ease, duration })({ alpha: 0 })
        container.removeChildAt(1)
    }

export const SetImage = { beforeInit, init: setImage, afterInit, run: setImage }

// type MoveImageCommandArgs = {
//     target: string
// } & TweenCommandArgs

// const moveImage: CommandRunFunction<MoveImageCommandArgs> =
//     ({
//         state,
//         stage
//         // save: {
//         //     global: { cg }
//         // }
//     }) =>
//     ({ name, file, x = 0, y = 0, z = 1, w, h }) => {
//         // if (!cg().includes(file)) cg().push(file)
//         const container = new createjs.Container()
//         if (state === State.Init) {
//             const image = new Image()
//             image.meta = file
//             const bitmap = new createjs.Bitmap(image)
//             container.addChild(bitmap)
//         } else {
//             const bitmap = new createjs.Bitmap(file)
//             container.addChild(bitmap)
//         }
//         container.name = name
//         container.x = x
//         container.y = y
//         stage.addChildAt(container, z)
//     }

// x, y,w, h,duration,transition可选,若不设定则保持原参数
// const move =
//     (context) =>
//     ({ target, x, y, w, h, duration, transition }) => {}

// //如果图片已经移动到视图外的话,其实清除与否是无所谓的事情了
// const clear =
//     (context) =>
//     ({ target }) => {}

// export { set, move, clear }
