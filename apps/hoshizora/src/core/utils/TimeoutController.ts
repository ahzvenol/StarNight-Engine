// 对回调进行包装,实现了暂停,恢复,立即执行和取消执行的功能
export class TimeoutController {
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
