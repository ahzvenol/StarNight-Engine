import { logger } from "@/utils/Logger"
import { mapValues } from "es-toolkit"
import Mustache from 'mustache'
import book from '../assets/book.json'
import { EventDispatcher } from "./EventDispatcher"
import { Timer } from "./Timer"
import { GameContext, State, commands } from "./Command"
import { PromiseX } from "@/utils/PromiseX"

// 放在外部不好清理内存,干脆都写到一起
// tag:待考虑GC问题
const actStartEvent = new EventDispatcher<GameContext>()
const actEndEvent = new EventDispatcher<GameContext>()
const actSecondClickEvent = new EventDispatcher<GameContext>()
actStartEvent.subscribe(context => logger.info(`开始执行第${context.row}幕...`))
actEndEvent.subscribe(_ => logger.info('执行结束'))
actSecondClickEvent.subscribe(_ => logger.info('一幕内第二次点击,立即执行'))

// 给予全部命令操作actindex的能力是危险的,有几个特殊的命令会影响主循环,可以单独提出
function runAct(
    row: number,
    state: State,
    onClick: () => Promise<void>,
    onFast: () => Promise<void>
) {
    const timer = new Timer()
    timer.addPauseMethod(() => createjs.Ticker.paused = true)
    timer.addStartMethod(() => createjs.Ticker.paused = false)
    const context = { timer, state, actIndex: row }
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
        // @ts-expect-error
        .then(() => mapValues(commands, command => command?.onActStart()))
        // 实现了命令内部的幕级中断,只需要返回一个Promise.reject()即可
        // 除了主动中断之外,不应该打断它
        .then(() =>
            book[row]
                .map(i => mapValues(i, value => Mustache.render(value, context)))
                .map(i => async () => commands[i['@']].run(context)(i))
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

export { runAct }

