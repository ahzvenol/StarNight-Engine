import Timer from './timer'
import createjs from 'createjs-npm'
import {compile} from '@/lib'

type stateSymbol = 'I' | 'F' | 'R'

class State {
    now: stateSymbol = 'I'
    actDoubleClick = () => this.timer.immed
    timer = new Timer();
    constructor(onActStart?: Function0<void>, onActEnd?: Function0<void>) {
        if (onActStart) this.bridge.onActStart = onActStart
        if (onActEnd) this.bridge.onActEnd = onActEnd
    }
    actStart = () => {
        this.timer = new Timer()
        this.bridge.onActStart()
        if (this.now === 'I' || this.now === 'F') this.timer.immedExec()
    }
    actEnd = () => {
        if (this.timer.allDone()) this.bridge.onActEnd()
        else this.timer.unstableCallback = () => { this.bridge.onActEnd() }
    }
    actRunning = () => !this.timer.allDone()
    bridge = {
        setTimeout: (callback: Function0<void>, ms: number) => this.timer.setTimeout(callback, ms),
        sleep: (wait: number) => this.timer.sleep(wait),
        // tag:或许单独控制每个Stage更好些,放到优化时候进行
        play: () => {
            this.timer.play()
            createjs.Ticker.paused = false
        },
        pause: () => {
            this.timer.pause()
            createjs.Ticker.paused = true
        },
        immedExec: () => { this.timer.immedExec() },
        onActStart: () => { },
        onActEnd: () => { }
    }
}

// #region
// type Function1Map<T = void> = Dictionary<(arg0: T) => void>

// interface Util {
//     onActStart(arg0: () => void): void
//     onActEnd(arg0: () => void): void
// }

// interface Lifecycle {
//     isInit(arg0: () => void): void
//     isFast(arg0: () => void): void
//     isClick(arg0: () => void): void
//     notInit(arg0: () => void): void
//     notFast(arg0: () => void): void
//     notClick(arg0: () => void): void
// }

interface Util {
    onActStart: Function1<Function0<void>, void>
    onActEnd: Function1<Function0<void>, void>
}

interface Lifecycle {
    isInit: Function1<Function0<void>, void>
    isFast: Function1<Function0<void>, void>
    isClick: Function1<Function0<void>, void>
    notInit: Function1<Function0<void>, void>
    notFast: Function1<Function0<void>, void>
    notClick: Function1<Function0<void>, void>
}

function newUtil(state: State): Util {
    // utils
    const util: Dictionary<Function1<Function0<void>, void>> = {}
    let actStartCallBackList: Array<() => void> = []
    util.onActStart = fn => {
        actStartCallBackList.push(fn)
    }
    state.bridge.onActStart = () => {
        actStartCallBackList.forEach(fn => fn())
        actStartCallBackList = []
    }
    let actEndCallBackList: Array<Function0<void>> = []
    util.onActEnd = fn => {
        actEndCallBackList.push(fn)
    }
    state.bridge.onActEnd = () => {
        actEndCallBackList.forEach(fn => fn())
        actEndCallBackList = []
    }
    return util as unknown as Util
}

function newLifecycle(state: State) {
    const lifecycle: Lifecycle = {
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
    return lifecycle
}
// #endregion
export { State, newUtil, newLifecycle }