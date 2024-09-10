import { makeQuerablePromise } from "@/utils"
import logger from "@/utils/Logger"
import { delay, mapValues } from "es-toolkit"
import { Reactive, useReactive } from "micro-reactive"
import Mustache from 'mustache'
import book from '../assets/book.json'
import { EventDispatcher, on } from "./EventDispatcher"
import { Timer } from "./Timer"
import PromiseX from "@/utils/PromiseX"

type GameContext = Dictionary

type Command = Function1<GameContext, Function1<Dictionary, Promise<void> | void>>

declare const commands: Dictionary<Command>

enum State {
    Init,
    Normal,
    Fast,
    Auto
}

// 放在外部不好清理内存,干脆都写到一起
// tag:待考虑GC问题
const actStartEvent = new EventDispatcher<GameContext>()
const actEndEvent = new EventDispatcher<GameContext>()
const actSecondClickEvent = new EventDispatcher<GameContext>()
actStartEvent.subscribe(context => logger.info(`开始执行第${context.actIndex()}幕...`))
actEndEvent.subscribe(_ => logger.info('执行结束'))
actSecondClickEvent.subscribe(_ => logger.info('一幕内第二次点击,立即执行'))

function runAct(
    rowIndex: number,
    state: State,
    onClick: () => Promise<void>,
    onFast: () => Promise<void>
) {
    const timer = new Timer()
    timer.addPauseMethod(() => createjs.Ticker.paused = true)
    timer.addStartMethod(() => createjs.Ticker.paused = false)
    const context = { timer }
    if (state == State.Fast) timer.toImmediate()
    // 在一幕的效果没有全部执行完毕的情况下,第二次点击会加速本幕,通过timer立即执行全部效果
    // 如果没有命令阻塞的特殊情况,调用timer.toImmediate后会将promise链推进至actEnd
    const immPromise = new PromiseX()
    immPromise
        .then(() => actSecondClickEvent.publish(context))
        .then(timer.toImmediate)
    Promise.race([onClick(), onFast()]).then(immPromise.resolve)
    const actPromise = Promise.resolve()
        .then(() => actStartEvent.publish(context))
        .then(() => mapValues(commands, command => command?.onActStart()))
        // 实现了命令内部的幕级中断,只需要返回一个Promise.reject()即可
        // 除了主动中断之外,不应该打断它
        .then(() =>
            book[rowIndex]
                .map(i => mapValues(i, value => Mustache.render(value, context)))
                .map(i => async () => commands[i['@']]?.(context)(i))
                .reduce((p, e) => p.then(e), Promise.resolve())
                .catch()
        )
        // 如果没有变更状态到Fast,最后需要对提交的setTimeouts进行检查,确定本幕是否彻底完成
        .then(() => Promise.all(timer.promiseList))
        // 如果mainloop已经执行完成了,执行本幕的secondClick操作就不再有意义
        .then(immPromise.reject)
        .then(() => actEndEvent.publish(context))
    return actPromise
}

// tag:State需要传递一个指针而不是一个值，暂时使用这种形式
function runActLoop(
    clickEvent: EventDispatcher<void>,
    fastEvent: EventDispatcher<void>,
    autoEvent: EventDispatcher<void>,
    actIndex: Reactive<number>
) {
    const onClick = on(clickEvent)
    const onFast = on(fastEvent)
    const onAuto = on(autoEvent)

    const state = useReactive(State.Normal)
    fastEvent.subscribe(() => state(state() === State.Fast ? State.Normal : State.Fast))
    autoEvent.subscribe(() => state(state() === State.Auto ? State.Normal : State.Auto))
    // 只有两个地方会有阻塞:正在运行一幕,等待点击事件
    // 为了更清晰的表示,用Promise.race同时监听几个事件来推进幕循环
    // auto的话,不需要去加速正在运行的幕,但是需要去推动已经停止的循环
    // 像是选项要卡死幕循环的情况,使用不在timer控制范围内的await就可以
    const loop: Function1<Reactive<number>, Promise<void>> =
        (actIndex) =>
            runAct(actIndex(), state(), onClick, onFast)
                .then(() => state() === State.Fast
                    ? delay(100)
                    : state() === State.Auto
                        ? Promise.resolve()
                        : Promise.race([onClick(), onAuto(), onFast()])
                )
                // .then(() => Promise.race([
                //     new Promise<State>((res) => {
                //         if (state === State.Auto || state === State.Fast) res(state)
                //     }),
                //     Promise.race([
                //         onClick().then(() => State.Normal),
                //         onAuto().then(() => State.Auto),
                //         onFast().then(() => State.Fast)
                //     ])
                // ]))
                // .then(state =>
                //     state === State.Fast
                //         ? delay(100)
                //         : Promise.resolve()
                // )
                .then(() => loop(actIndex))

    loop(actIndex)
}