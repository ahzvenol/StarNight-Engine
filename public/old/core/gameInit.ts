import State from './state'
import createjs from 'createjs-npm'
import { commands, commandPrototype } from './commands'

export default () => {
    const state = new State()

    // type Function1Map<T = void> = Dictionary<(arg0: T) => void>

    // utils
    // #region
    // const util: Function1Map<() => void> = {}
    const util: Dictionary<Function1<Function0<void>, void>> = {}
    let actStartCallBackList: Array<() => void> = []
    util.onActStart = fn => {
        actStartCallBackList.push(fn)
    }
    state.bridge.onActStart = () => {
        actStartCallBackList.forEach(fn => fn())
        actStartCallBackList = []
    }
    let actEndCallBackList: Array<() => void> = []
    util.onActEnd = fn => {
        actEndCallBackList.push(fn)
    }
    state.bridge.onActEnd = () => {
        actEndCallBackList.forEach(fn => fn())
        actEndCallBackList = []
    }
    // #endregion
    const lifecycle: Dictionary<Function1<Function0<void>, void>> = {
        isInit: fn => {
            if (state.now === 'I') fn()
        },
        isFast: fn => {
            if (state.now === 'F') fn()
        },
        isClick: fn => {
            if (state.now === 'R' && state.actDoubleClick() === false) fn()
        },
        notInit: fn => {
            if (state.now !== 'I') fn()
        },
        notFast: fn => {
            if (state.now !== 'F') fn()
        },
        notClick: fn => {
            if (state.now !== 'R' || state.actDoubleClick() !== false) fn()
        },
    }
    const canvas = new createjs.Stage('canvas')
    createjs.Ticker.addEventListener('tick', canvas)
    const backgroundContainer = new createjs.Container()
    backgroundContainer.name = 'background'
    canvas.addChild(backgroundContainer)
    backgroundContainer.addChild(new createjs.Bitmap('./static/bg_black.png'))
    // todo:这里应该有改动
    // $refs and canvans
    const original = {}
    // utils like setxxx()
    const stage = {}
    stage.canvas = canvas
    const temp = {
        // tag:新增一个存档和backlog变量，命令通过写入对应变量实现功能
        // $archive在存档时整个存入,backlog读取$backlog进行显示
        // issue:会不会出现一幕执行一半导致关键数据丢失的问题？
        // 现在应该还需要全局存档变量
        $archive: {},
        // $backlog: {},
        $lifecycle: lifecycle,
        $original: original,
        $stage: stage,
        // $config: ???,
        $sleep: state.bridge.sleep,
        $setTimeout: state.bridge.setTimeout,
    }
    // tag:这里把temp指向Vue组件实例应该因为命令里还有没完全分离的部分,先标记下
    // temp.__proto__ = this
    //@ts-ignore
    commandPrototype.__proto__ = temp
    return { commands, state, util }
}