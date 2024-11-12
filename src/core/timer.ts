// 对回调进行包装,实现了暂停,恢复,立即执行和取消执行的功能
class TimeoutController {
    private executeOnceCallback: () => void
    private timerId: number | undefined = undefined
    private startTime: number = 0
    private remainingTime: number
    private _isExecuted: boolean = false
    private _isStarted: boolean = false
    public get isExecuted(): boolean {
        return this._isExecuted
    }
    constructor(callback: () => void, delay: number) {
        this.executeOnceCallback = () => {
            if (this._isExecuted) return
            this._isExecuted = true
            callback()
        }
        this.remainingTime = delay
    }

    public start = () => {
        if (this._isStarted || this._isExecuted) return
        this._isStarted = true
        this.startTime = Date.now()
        this.timerId = window.setTimeout(this.executeOnceCallback, this.remainingTime)
    }
    public pause = () => {
        if (!this._isStarted || this._isExecuted) return
        this._isStarted = false
        window.clearTimeout(this.timerId)
        this.remainingTime = this.remainingTime - (Date.now() - this.startTime)
    }
    public immediateExecution = () => {
        if (this._isExecuted) return
        window.clearTimeout(this.timerId)
        this.executeOnceCallback()
    }
    public cancel = () => {
        if (this._isExecuted) return
        window.clearTimeout(this.timerId)
    }
}
// Timer假设在最后一个延时回调完成之后不会再有新的新的延时回调被注册,否则永远无法确定执行是否结束
class TimerX {
    private _isImmediate = false
    public get isImmediate(): boolean {
        return this._isImmediate
    }
    private _isPaused = false
    public get isPaused(): boolean {
        return this._isPaused
    }
    public startList: Array<Function0<void>> = []
    public pauseList: Array<Function0<void>> = []
    public resolveList: Array<Function0<void>> = []
    public setTimeout = (callback: Function0<void>, ms: number) => this.delay(ms).then(callback)
    public delay = (wait: number) => {
        if (this.isImmediate) {
            return Promise.resolve()
        } else {
            const promise = new Promise<void>((res) => {
                const controller = new TimeoutController(res, wait)
                this.addResumeMethod(controller.start)
                this.addPauseMethod(controller.pause)
                this.addFinalizeMethod(controller.immediateExecution)
                if (!this.isPaused) controller.start()
            })
            return promise
        }
    }
    // 为外部不可控第三方库添加暂停和取消暂停方法,比如createjs.Ticker.paused = true
    public addResumeMethod = (fn: Function0<void>): void => {
        if (this.isImmediate) return
        this.startList.push(fn)
    }
    public addPauseMethod = (fn: Function0<void>): void => {
        if (this.isPaused) fn()
        else if (this.isImmediate) return
        this.pauseList.push(fn)
    }
    // 为外部不可控第三方库的操作添加结束方法,比如tween.setPosition(tween.duration)
    public addFinalizeMethod = (fn: Function0<void>): void => {
        if (this.isImmediate) fn()
        else this.resolveList.push(fn)
    }

    public start = () => {
        if (this.isImmediate) return
        this.startList.forEach((e) => e())
    }
    public pause = () => {
        if (this.isImmediate || this.isPaused) return
        this._isPaused = true
        this.pauseList.forEach((e) => e())
    }
    public toImmediate = () => {
        if (this.isImmediate) return
        this._isImmediate = true
        this.resolveList.forEach((e) => e())
    }
}

// export方便代码提示一点
export { TimerX as Timer }
