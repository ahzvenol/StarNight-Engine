import { makeQuerablePromise } from "@/utils"
import { Reactive } from "micro-reactive"
import Timer from "./timer"
import { EventDispatcher, on } from "./EventDispatcher"
import logger from "@/utils/Logger"











// 提供为可注册的回调,最好catch一下
// 可以在里面提供点环境数据
// function onActStart() {

// }
// function onActEnd() {

// }

// function onSecondClick() {

// }


// class State {
//     now: stateSymbol = 'I'
//     timer = new Timer();
//     // 实际上并不是此种判断,但是配合下面的Util就正常了,为避免误用挪到下面,此行注释
//     // actDoubleClicked = () => this.timer.immed
//     // constructor(onActStart?: Function0<void>, onActEnd?: Function0<void>) {
//     //     if (onActStart) this.bridge.onActStart = onActStart
//     //     if (onActEnd) this.bridge.onActEnd = onActEnd
//     // }
//     // actStart = () => {
//     //     this.timer = new Timer()
//     //     this.bridge.onActStart()
//     //     if (this.now === 'I' || this.now === 'F') this.timer.immedExec()
//     // }
//     // actEnd = () => {
//     //     if (this.timer.allDone()) this.bridge.onActEnd()
//     //     else this.timer.unstableCallback = () => { this.bridge.onActEnd() }
//     // }
//     // tag:能正确的清理却无法正确的判断是否清理,这样有点糟糕
//     actRunning = () => !this.timer.allDone()
//     // tag:或许单独控制每个Stage更好些,放到优化时候进行
//     start = () => {
//         this.timer.start()
//         createjs.Ticker.paused = false
//     }
//     pause = () => {
//         this.timer.pause()
//         createjs.Ticker.paused = true
//     }
// }

// todo 状态判断
// 好像意义不太大了,命令可以自己if去
// class StateUtil {
//     constructor(private state: State) { }
//     private isInit = () => this.state === 'I';
//     private isFast = () => this.state === 'F';
//     private isRuntime = () => this.state === 'N' && !this.timer.isImmediate;
//     private when = (cond: () => boolean, fn: () => void): void => { if (cond.call(this)) fn() }
//     public whenInit = (fn: () => void) => this.when(this.isInit, fn);
//     public whenFast = (fn: () => void) => this.when(this.isFast, fn);
//     public whenRuntime = (fn: () => void) => this.when(this.isRuntime, fn);
//     private not = (cond: () => boolean, fn: () => void): void => { if (!cond.call(this)) fn() }
//     public notInit = (fn: () => void) => this.not(this.isInit, fn);
//     public notFast = (fn: () => void) => this.not(this.isFast, fn);
//     public notRuntime = (fn: () => void) => this.not(this.isRuntime, fn);
// }