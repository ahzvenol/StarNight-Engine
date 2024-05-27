interface TimeoutController {
    play:Function0<void>
    pause:Function0<void>
    immedExec:Function0<void>
    cancel:Function0<void>
}

function setTimeout(callback:Function0<void>, delay: number): TimeoutController {
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
    promiseTimeout: TimeoutController | null = null
    setTimeoutList: Array<TimeoutController> = []
    timeoutDoneConut = 0
    unstableCallback = () => { }
    setTimeout(callback: Function0<any>, ms: number) {
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
        return new Promise<void>((res) => {
            this.promiseTimeout = setTimeout(res, wait)
        })
    }
    play() {
        this.promiseTimeout?.play()
        this.setTimeoutList.forEach(obj => obj.play())
    }
    pause() {
        this.promiseTimeout?.pause()
        this.setTimeoutList.forEach(obj => obj.pause())
    }
    immedExec() {
        this.immed = true
        this.promiseTimeout?.immedExec()
        this.setTimeoutList.forEach(obj => obj.immedExec())
    }
    cancel() {
        this.promiseTimeout?.cancel()
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

export default Timer