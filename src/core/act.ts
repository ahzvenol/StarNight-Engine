import { Reactive } from "micro-reactive"
import { makeQuerablePromise } from "@/util"
import logger from "@/util/logger"
import { EventDispatcher, on } from "./EventDispatcher"
import Timer from "./timer"

declare const Book: Array<Array<Dictionary>>

type GameContext = Dictionary

type Command = Function1<GameContext, Function1<Dictionary, Promise<void> | void>>

declare const commands: Dictionary<Command>

const actStartEvent = new EventDispatcher<GameContext>()
const actEndEvent = new EventDispatcher<GameContext>()
const actSecondClickEvent = new EventDispatcher<GameContext>()

actStartEvent.subscribe(context => logger.info(`开始执行第${context.actIndex()}幕...`))
actEndEvent.subscribe(_ => logger.info('执行结束'))
actSecondClickEvent.subscribe(_ => logger.info('一幕内第二次点击,立即执行'))


enum State {
    Init = 'I',
    Normal = 'N',
    Fast = 'F',
    Auto = 'A'
}

// tag:State需要传递一个指针而不是一个值，暂时使用这种形式
function runActLoop(
    clickEvent: EventDispatcher<void>,
    fastEvent: EventDispatcher<void>,
    autoEvent: EventDispatcher<void>,
    state: Reactive<State>
) {
    const onClick = on(clickEvent)
    const onFast = on(fastEvent)
    const onAuto = on(autoEvent)
    // function onClick(): Promise<void> {
    //     return new Promise(clickEvent.once) as unknown as Promise<void>
    // }
    function runAct(rowIndex: number) {
        const timer = new Timer()
        const context = { timer }
        if (state() == State.Fast) timer.toImmediate()
        const actPromise = Promise.resolve()
            .then(onActStart)
            .then(() => {
                // 实现了命令内部的幕级中断,只需要返回一个Promise.reject()即可
                // 除了主动中断之外,不应该打断它
                const mainloopPromise = book[rowIndex]
                    .map(i => async () => commands[i['@']]?.(context)(i))
                    .reduce((p, e) => p.then(e), Promise.resolve())
                    .catch()

                Promise.race([onClick(), onFast()])
                    // mainloop如果已经执行完成了,这里就不应该继续了
                    // 响应不是同步的,所以可能会出现误执行,但是误执行影响小于不执行
                    .then(() => makeQuerablePromise(mainloopPromise).isPending()
                        ? Promise.resolve()
                        : Promise.reject())
                    .then(onSecondClick)
                    .then(timer.toImmediate)
                return mainloopPromise
            })
            // 如果没有变更状态到立即执行,最后需要对提交的setTimeout进行检查,确定本幕是否彻底完成
            .then(() => Promise.all(timer.timeoutPromiseList))
            .then(onActEnd)
        return actPromise
    }
    // 只有两个地方会有延迟,正在运行一幕,等待点击事件
    // 只需要在进入fast模式之前发布一次点击事件,接下来就可以进入快速循环了
    // 为了更清晰的表示,用Promise.race同时监听几个事件也可以达到相同效果
    // auto的话,不需要去加速正在运行的幕,但是需要去推动已经停止的循环
    // 像是选项要卡死幕循环的情况,不在timer控制范围内的await就可以
    function loop(actIndex: Reactive<number>) {
        runAct(actIndex())
            .then(() => state() === State.Fast
                ? new Timer().delay(100)
                : state() === State.Auto
                    ? Promise.resolve()
                    : Promise.race([onClick(), onAuto(), onFast()]))
            .then(() => loop(actIndex))
    }
    loop(0)
}