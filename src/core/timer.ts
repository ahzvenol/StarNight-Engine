class TimeoutController {
    private callbackFn: () => void
    private timerId: number | null = null;
    private startTime: number = 0;
    private remainingTime: number
    private _isExecuted: boolean = false;
    public get isExecuted(): boolean {
        return this._isExecuted
    }
    constructor(callback: () => void, delay: number) {
        this.callbackFn = callback
        this.remainingTime = delay
        this.start()
    }
    private executeCallback = () => {
        this._isExecuted = true
        this.callbackFn()
    }
    public start() {
        this.startTime = Date.now()
        if (this.timerId !== null) {
            clearTimeout(this.timerId)
        }
        this.timerId = window.setTimeout(this.executeCallback, this.remainingTime)
    }
    public pause() {
        if (this.timerId !== null) {
            clearTimeout(this.timerId)
        }
        this.remainingTime -= Date.now() - this.startTime
    }
    public immediateExecution() {
        if (this.timerId !== null) {
            clearTimeout(this.timerId)
        }
        this.executeCallback()
    }
    public cancel() {
        this._isExecuted = true
    }
}


// Timer假设在最后一个延时回调完成之后不会再有新的新的延时回调被注册,否则永远无法确定执行是否结束
// 场上还有类似create的动画延时，或许准确的确定actEnd是不现实的
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
    // 立即执行时,会导致死循环
    // public setInterval(callback: Function0<any>, ms: number) {
    //     const run = () => {
    //         this.setTimeout(() => {
    //             callback()
    //             run()
    //         }, ms)
    //     }
    //     run()
    // }
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

// class CountTimer extends Timer {
//     timeoutDoneConut = 0
//     unstableCallback = () => { }
//     setTimeout(callback: Function0<any>, ms: number): void {
//         // 记录调用时的immed变量状态,以这种方式实现在immed为true时跳过计数,配合上面...
//         // fix 似乎有点藕,需要研究下方案
//         // const nowImmed = this.immed
//         // let conutedCallback = () => {
//         //     callback()
//         //     if (nowImmed === false) this.timeoutDoneConut++
//         //     if (this.setTimeoutList.length === this.timeoutDoneConut) this.unstableCallback()
//         // }
//         // super.setTimeout(conutedCallback, ms)
//         // 似乎好一点,但是这个if重复的问题怎么办呢
//         if (this.immed) {
//             callback()
//         } else {
//             let conutedCallback = () => {
//                 callback()
//                 this.timeoutDoneConut++
//                 if (this.setTimeoutList.length === this.timeoutDoneConut) this.unstableCallback()
//             }
//             super.setTimeout(conutedCallback, ms)
//         }
//     }
//     // allDone() {
//     //     if (this.setTimeoutList.length === this.timeoutDoneConut) {
//     //         return true
//     //     } else {
//     //         return false
//     //     }
//     // }
// }

export default CountTimer