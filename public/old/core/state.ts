type TimeoutController = {
    play: () => void
    pause: () => void
    immedExec: () => void
    cancel: () => void
}

function setTimeout(callback: () => any, delay: number): TimeoutController {
    let setTimeoutId: number
    let start: number, remaining = delay

    let flag = true
    let singleUseCallback = () => {
        if (flag) {
            callback()
            flag = false
        }
    }

    function play() {
        start = new Date().valueOf()
        window.clearTimeout(setTimeoutId)
        setTimeoutId = window.setTimeout(singleUseCallback, remaining)
    };

    function pause() {
        window.clearTimeout(setTimeoutId)
        remaining = remaining - (new Date().valueOf() - start)
    };

    function immedExec() {
        window.clearTimeout(setTimeoutId)
        singleUseCallback()
    }

    function cancel() {
        flag = false
    }

    play()

    return { play, pause, immedExec, cancel }
}


class Timer {
    immed = false
    promiseTimeout: TimeoutController | any = {}
    setTimeoutList: Array<TimeoutController> = []
    timeoutDoneConut = 0
    unstableCallback = () => { }
    setTimeout(callback: () => any, ms: number) {
        if (this.immed) {
            callback()
            return
        }
        let conutedCallback = () => {
            callback()
            this.timeoutDoneConut++
            if (this.setTimeoutList.length === this.timeoutDoneConut) this.unstableCallback()
        }
        this.setTimeoutList.push(setTimeout(conutedCallback, ms))
    }
    // tag:
    setInterval() { }
    sleep(wait: number) {
        if (this.immed) return
        return new Promise<void>((res, rej) => {
            this.promiseTimeout = setTimeout(res, wait)
        })
    }
    play() {
        this.promiseTimeout?.play?.()
        this.setTimeoutList.forEach(obj => obj.play())
    }
    pause() {
        this.promiseTimeout?.pause?.()
        this.setTimeoutList.forEach(obj => obj.pause())
    }
    immedExec() {
        this.immed = true
        this.promiseTimeout?.immedExec?.()
        this.setTimeoutList.forEach(obj => obj.immedExec())
    }
    cancel() {
        this.promiseTimeout?.cancel?.()
        this.setTimeoutList.forEach(obj => obj.cancel())
    }
    allDone() {
        if (this.setTimeoutList.length === this.timeoutDoneConut) {
            return true
        } else {
            return false
        }
    }
}
type stateSymbol = 'I' | 'F' | 'R'

import createjs from 'createjs-npm'
class State {
    now: stateSymbol = 'I'
    actDoubleClick = () => this.timer.immed
    timer = new Timer();
    constructor(onActStart?: () => any, onActEnd?: () => any) {
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
        setTimeout: (callback: () => any, ms: number) => this.timer.setTimeout(callback, ms),
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
export default State