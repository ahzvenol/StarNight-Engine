import { CommandRunFunction, State } from '@/core/Command'
// 跨幕环境变量file,需要收集副作用

const afterInit = () => {}

// z,w,h可选,若不设定则默认在最上层,保持图片原宽高
const set: CommandRunFunction =
    ({
        state,
        stage,
        save: {
            global: { cg }
        }
    }) =>
    ({ name, file, x, y, z, w, h }) => {
        if (!cg().includes(file)) cg().push(file)
        const container = new createjs.Container()
        if (state === State.Init) {
            const image = new Image()
            image.id = file
            const bitmap = new createjs.Bitmap(image)
            container.addChild(bitmap)
        } else {
            const bitmap = new createjs.Bitmap(file)
            container.addChild(bitmap)
        }
        container.name = name
        container.x = x
        container.y = y
        stage.addChild(container)
    }

// x, y,w, h,duration,transition可选,若不设定则保持原参数
const move =
    (context) =>
    ({ target, x, y, w, h, duration, transition }) => {}

//如果图片已经移动到视图外的话,其实清除与否是无所谓的事情了
const clear =
    (context) =>
    ({ target }) => {}

export { set, move, clear }
