// 对回调进行包装,实现了暂停,恢复,立即执行和取消执行的功能
class TimeoutController {
    private executeOnceCallback: () => void
    private timerId: number | undefined = undefined;
    private startTime: number = 0;
    private remainingTime: number
    private _isExecuted: boolean = false;
    private _isStarted: boolean = true;
    public get isExecuted(): boolean {
        return this._isExecuted
    }
    constructor(callback: () => void, delay: number) {
        this.executeOnceCallback = () => {
            this._isExecuted = true
            callback()
        }
        this.remainingTime = delay
        this.start()
    }

    public start() {
        if (this._isStarted) return
        this._isStarted = true
        this.startTime = Date.now()
        this.timerId = window.setTimeout(this.executeOnceCallback, this.remainingTime)
    }
    public pause() {
        if (!this._isStarted) return
        this._isStarted = false
        window.clearTimeout(this.timerId)
        this.remainingTime = this.remainingTime - (Date.now() - this.startTime)
    }
    public immediateExecution() {
        window.clearTimeout(this.timerId)
        this.executeOnceCallback()
    }
    public cancel() {
        this._isExecuted = true
    }
}


// Timer假设在最后一个延时回调完成之后不会再有新的新的延时回调被注册,否则永远无法确定执行是否结束
class Timer {
    private _isImmediate = false;
    public get isImmediate(): boolean {
        return this._isImmediate
    }
    private timeoutControllerList: TimeoutController[] = [];
    // tag:目前在原则上不允许嵌套调用,之后考虑代码限制
    public setTimeout(callback: Function0<void>, ms: number) {
        if (this._isImmediate) callback()
        else this.timeoutControllerList.push(new TimeoutController(callback, ms))
    }
    // 立即执行时,会导致死循环,暂时放弃这个功能
    // public setInterval(callback: Function0<void>, ms: number) {
    public delay(wait: number) {
        if (this._isImmediate) return Promise.resolve()
        else return new Promise<void>((resolve) => {
            this.timeoutControllerList.unshift(new TimeoutController(resolve, wait))
        })
    }
    public start() {
        this.timeoutControllerList.forEach(e => e.start())
    }
    public pause() {
        this.timeoutControllerList.forEach(e => e.pause())
    }
    public toImmediate() {
        this._isImmediate = true
        this.timeoutControllerList.forEach(e => e.immediateExecution())
    }
    public cancel() {
        this.timeoutControllerList.forEach(e => e.cancel())
    }
}

class CountTimer extends Timer {
    public timeoutPromiseList: Promise<void>[] = []
    public setTimeout(callback: Function0<void>, ms: number): void {
        if (this.isImmediate) callback()
        else this.timeoutPromiseList.push(new Promise(res => super.setTimeout(() => { res(); callback() }, ms)))
    }
}

export default CountTimer