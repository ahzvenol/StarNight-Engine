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
        this._isPaused = false
        this.startList.forEach((e) => e())
    }
    public pause = () => {
        if (this.isImmediate || this.isPaused) return
        this._isPaused = true
        this.pauseList.forEach((e) => e())
    }
    public immediateExecution = () => {
        if (this.isImmediate) return
        this._isImmediate = true
        this.resolveList.forEach((e) => e())
    }
}

// export方便代码提示一点
export { TimerX as Timer }
