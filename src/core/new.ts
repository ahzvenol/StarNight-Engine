import { EventDispatcher, logger, makeQuerablePromise } from "@/util"
import { on } from "events"
import { Reactive } from "micro-reactive"
import Timer from "./timer"

declare const Book: Array<Array<Dictionary>>

type GameContext = Dictionary

type Command = Function1<GameContext, Function1<Dictionary, Promise<void> | void>>

declare const commands: Dictionary<Command>

// async function runAct(rowIndex: number) {
//     if (state.actRunning()) {
//         onSecondClick()
//         state.bridge.immedExec()
//     } else {
//         onActStart()
//         // 实现了命令内部的幕级中断,只需要返回一个Promise.reject()即可
//         book[rowIndex]
//             .map(i => async () => commands[i['@']]?.['R'](i))
//             .reduce<Promise<void>>((p, e) => p.then(() => e()), Promise.resolve())
//             .catch().then(onActEnd)
//     }
// }



function runActWith(clickEventDisPatcher: EventDispatcher<MouseEvent>) {
    function onClick(): Promise<MouseEvent> {
        return new Promise(clickEventDisPatcher.subscribeOnce)
    }
    function runAct(rowIndex: number) {
        const timer = new Timer()
        const context = { timer }
        const actPromise = onActStart()
            .then(_ => {
                // 实现了命令内部的幕级中断,只需要返回一个Promise.reject()即可
                // 除了主动中断之外,不应该打断它
                const mainloopPromise = book[rowIndex]
                    .map(i => async () => commands[i['@']]?.(context)(i))
                    .reduce((p, e) => p.then(e), Promise.resolve())
                    .catch()

                onClick()
                    // mainloop如果已经执行完成了,这里就不应该继续了
                    // 响应不是同步的,所以可能会出现误执行,但是误执行影响小于不执行
                    .then(_ => {
                        if (makeQuerablePromise(mainloopPromise).isPending())
                            return Promise.resolve()
                        else
                            return Promise.reject()
                    })
                    .then(onSecondClick)
                    .then(timer.toImmediate)
                return mainloopPromise
            })
            .then(() => Promise.all(timer.timeoutPromiseList))
            .then(onActEnd)
        return actPromise
    }
    function loop(rowIndex: number) {
        runAct(rowIndex).then(onClick).then(() => loop(rowIndex + 1))
    }
    return loop
}

// 提供为可注册的回调,最好catch一下
// 可以在里面提供点环境数据
async function onActStart() {
    logger.info(`开始执行第${rowIndex()}幕...`)
    rowIndex(rowIndex() + 1)
}

async function onActEnd() {
    logger.info('执行结束')
}

async function onSecondClick() {
    logger.info('二次点击,立即执行全部回调')
}

class State {
    now: stateSymbol = 'I'
    timer = new Timer();
    // 实际上并不是此种判断,但是配合下面的Util就正常了,为避免误用挪到下面,此行注释
    // actDoubleClicked = () => this.timer.immed
    // constructor(onActStart?: Function0<void>, onActEnd?: Function0<void>) {
    //     if (onActStart) this.bridge.onActStart = onActStart
    //     if (onActEnd) this.bridge.onActEnd = onActEnd
    // }
    // actStart = () => {
    //     this.timer = new Timer()
    //     this.bridge.onActStart()
    //     if (this.now === 'I' || this.now === 'F') this.timer.immedExec()
    // }
    // actEnd = () => {
    //     if (this.timer.allDone()) this.bridge.onActEnd()
    //     else this.timer.unstableCallback = () => { this.bridge.onActEnd() }
    // }
    // tag:能正确的清理却无法正确的判断是否清理,这样有点糟糕
    actRunning = () => !this.timer.allDone()
    // tag:或许单独控制每个Stage更好些,放到优化时候进行
    start = () => {
        this.timer.start()
        createjs.Ticker.paused = false
    }
    pause = () => {
        this.timer.pause()
        createjs.Ticker.paused = true
    }
}

class StateUtil {
    constructor(private state: State) { }
    private isInit = () => this.state.now === 'I';
    private isFast = () => this.state.now === 'F';
    private isRuntime = () => this.state.now === 'R' && !this.state.timer.isImmediate;
    private when = (cond: () => boolean, fn: () => void): void => { if (cond.call(this)) fn() }
    public whenInit = (fn: () => void) => this.when(this.isInit, fn);
    public whenFast = (fn: () => void) => this.when(this.isFast, fn);
    public whenRuntime = (fn: () => void) => this.when(this.isRuntime, fn);
    private not = (cond: () => boolean, fn: () => void): void => { if (!cond.call(this)) fn() }
    public notInit = (fn: () => void) => this.not(this.isInit, fn);
    public notFast = (fn: () => void) => this.not(this.isFast, fn);
    public notRuntime = (fn: () => void) => this.not(this.isRuntime, fn);
}


// class ActUtil {
//     constructor(private state: State) {}
//     isInit(): boolean {
//         return this.state.now === 'I';
//     }
//     isFast(): boolean {
//         return this.state.now === 'F';
//     }
//     isRuntime(): boolean {
//         return this.state.now === 'R' && this.state.timer.immed === false;
//     }
//     whenInit(fn: () => void): void {
//         if (this.state.now === 'I') {
//             fn();
//         }
//     }
//     whenFast(fn: () => void): void {
//         if (this.state.now === 'F') {
//             fn();
//         }
//     }
//     whenRuntime(fn: () => void): void {
//         if (this.state.now === 'R' && this.state.timer.immed === false) {
//             fn();
//         }
//     }
//     notInit(fn: () => void): void {
//         if (!this.isInit()) {
//             fn();
//         }
//     }
//     notFast(fn: () => void): void {
//         if (!this.isFast()) {
//             fn();
//         }
//     }
//     notRuntime(fn: () => void): void {
//         if (!this.isRuntime()) {
//             fn();
//         }
//     }
// }