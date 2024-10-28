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
    Y<createjs.DisplayObject, void>((rec) => (displayObject) => {
        if ('children' in displayObject && Array.isArray(displayObject.children)) {
            displayObject.children.forEach(rec)
        } else if (displayObject instanceof createjs.Bitmap) {
            const bitmap = displayObject
            if (bitmap.image.tagName === 'image') {
                const container = bitmap.parent
                container.removeChild(bitmap)
                container.addChild(new createjs.Bitmap(bitmap.image.getAttribute('meta')!))
            }
        }
    })(stage)

// z,w,h可选,若不设定则默认在最上层,保持图片原宽高
const setImage: CommandRunFunction<SetImageCommandArgs> =
    (context) =>
    ({ name, file, ease, duration, x = 0, y = 0, z, w, h }) => {
        const { state, stage, save } = context
        // if (!cg().includes(file)) cg().push(file)
        const container = match(stage.getChildByName(name))
            .with(P.nullish, () => {
                const container = new createjs.Container()
                container.name = name
                stage.addChild(container)
                return container
            })
            .otherwise((e) => e as createjs.Container)
        const bitmap = match(state)
            // @ts-expect-error 类型与属性识别异常
            .with(State.Init, () => new createjs.Bitmap(<image attr:meta={file} />))
            .otherwise(() => new createjs.Bitmap(file))
        // 由于直接给bitmap更新src不起作用,叠加一层容器用来保存bitmap的属性
        // 在初始化之后会以移除bitmap再插入新bitmap的方式更新视图
        const bitmapPlaceholder = new createjs.Container()
        bitmapPlaceholder.x = x
        bitmapPlaceholder.y = y
        bitmapPlaceholder.addChild(bitmap)
        container.addChildAt(bitmapPlaceholder, 0)
        stage.setChildIndex(container, z ?? stage.getChildIndex(container) ?? 1)
        if (container.getChildAt(1)) {
            Tween(context)({ target: container.getChildAt(1), ease, duration })({ alpha: 0 }).then(() => {
                container.removeChildAt(1)
            })
        }
    }

export const SetImage = setImage

export const SetImageHooks = { beforeInit, afterInit }

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
