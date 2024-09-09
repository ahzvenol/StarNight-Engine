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

class TrackableTimer extends Timer {
    public promiseList: Promise<void>[] = []
    public startList: Function0<void>[] = []
    public pauseList: Function0<void>[] = []
    public resolveList: Function0<void>[] = []
    // 对原Timer的setTimeout包装一层promise
    public setTimeout(callback: Function0<void>, ms: number): void {
        if (this.isImmediate) callback()
        else this.promiseList.push(new Promise(res => super.setTimeout(() => { res(); callback() }, ms)))
    }
    // 添加外部不可控第三方库的结束回调Promise,将其纳入timer时间统计的方法(无法控制)
    public addTrackedPromise(promise: Promise<void>): void {
        // 在toImmediate()后,TrackableTimer应返回resolve状态的promise序列,包括外部promise也是如此
        const promiseForimmediate = new Promise<void>((res) => this.resolveList.push(res))
        this.promiseList.push(Promise.race([promise, promiseForimmediate]).catch())
    }
    // 为外部不可控第三方库的操作添加结束方法,比如tween.setPosition(tween.duration)
    public addManualResult(fn: Function0<void>): void {
        this.resolveList.push(fn)
    }
    public addStartMethod(fn: Function0<void>): void {
        this.startList.push(fn)
    }
    public addPauseMethod(fn: Function0<void>): void {
        this.pauseList.push(fn)
    }
    public start() {
        this.startList.forEach(e => e())
        super.start()
    }
    public pause() {
        this.pauseList.forEach(e => e())
        super.pause()
    }
    public toImmediate() {
        this.resolveList.forEach(e => e())
        super.toImmediate()
    }
}

// export方便代码提示一点
export { TrackableTimer as Timer }