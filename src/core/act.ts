import { Store } from '@/store/default'
import { log } from '@/utils/Logger'
import { PromiseX } from '@/utils/PromiseX'
import { Signal } from '@/utils/Reactive'
import { Y } from '@/utils/FPUtil'
import { delay, mapValues } from 'es-toolkit'
import { ReactiveType } from 'micro-reactive'
import Mustache from 'mustache'
import { match, P } from 'ts-pattern'
import book from '../assets/book.json'
import { GameRuntimeContext, State } from './Command'
import { EventDispatcher } from './EventDispatcher'
import { Timer } from './Timer'
import { commands } from './commands'
import { par } from './macro'
import { tracks } from './commands/script/audio'

const actStartEvent = new EventDispatcher<GameRuntimeContext>()
const actEndEvent = new EventDispatcher<GameRuntimeContext>()
const actSecondClickEvent = new EventDispatcher<GameRuntimeContext>()
actStartEvent.subscribe((context) => log.info(`开始执行第${context.row}幕...`))
actEndEvent.subscribe((context) => log.info(`第${context.row}幕执行结束`))
actSecondClickEvent.subscribe(() => log.info('一幕内第二次点击,立即执行'))

// 给予全部命令操作actindex的能力是危险的,有几个特殊的命令会影响主循环,可以单独提出
async function runAct(
    row: number,
    state: State,
    store: ReactiveType<Store>,
    onClick: Promise<void>,
    onFast: Promise<void>
) {
    const timer = new Timer()
    // fix:这些元素比timer活的都长,不合适用timer了
    // createjs库下一切操作的启动和暂停都可以通过以下两个操作管理,预先添加它以避免每个命令重复处理
    timer.addPauseMethod(() => (createjs.Ticker.paused = true))
    timer.addRestartMethod(() => (createjs.Ticker.paused = false))
    timer.addPauseMethod(() => mapValues(tracks, (audio) => audio.pause()))
    timer.addRestartMethod(() => mapValues(tracks, (audio) => audio.play()))
    // 如果现在是快进状态,直接把timer设置到立即执行
    if (state == State.Fast) timer.toImmediate()
    const context = { timer, state, store, row } as GameRuntimeContext
    // 在一幕的效果没有全部执行完毕的情况下,第二次点击会加速本幕,通过timer立即执行全部效果
    // 如果没有特殊阻塞,调用timer.toImmediate后会将promise链推进至actEnd
    const immPromise = new PromiseX()
    immPromise
        .then(() => actSecondClickEvent.publish(context))
        .then(timer.toImmediate)
        // 忽略调用reject导致的报错
        .catch((e) => {
            if (e !== undefined) log.error('Timer.toImmediate出错', e)
        })
    Promise.race([onClick, onFast]).then(immPromise.resolve)
    // act start
    actStartEvent.publish(context)
    mapValues(commands, (command) => command?.onActStart?.(context))
    // 收集命令返回的运行数据,处理可能影响游戏流程的部分,如jump和continue
    const commandOutput = await par(
        book[row]
            .map((args) =>
                mapValues(args, (value) =>
                    match(value)
                        .with(P.string, (value) => Mustache.render(value, context))
                        .otherwise((value) => value)
                )
            )
            .map(
                (args) => () =>
                    match(args['@'] in commands)
                        .with(true, () => commands[args['@']].run(context)(args))
                        .otherwise(() => log.error(`找不到命令:${args['@']}`, args))
            )
    )()
    // 如果本幕的命令都已经执行完成了,就可以解除对于第二次点击的监听
    immPromise.reject()
    actEndEvent.publish(context)
    return commandOutput
}

function runLoop(
    row: Signal<number>,
    state: Signal<State>,
    store: Store,
    onClick: () => Promise<void>,
    onAuto: () => Promise<void>,
    onFast: () => Promise<void>
) {
    return Y<void, Promise<void>>((rec) => async () => {
        // 幕运行过程中不会操作任何状态
        const res = await runAct(row(), state(), store(), onClick(), onFast())
        // 等待过程受continue命令影响
        if (res['continue'] !== true) {
            // 只有两个地方会有阻塞:正在运行一幕,等待点击事件
            // 为了更清晰的表示,用Promise.race同时监听几个事件来推进幕循环
            // auto的话,不需要去加速正在运行的幕,但是需要去推动已经停止的循环
            // 像是选项要卡死幕循环的情况,使用不在timer控制范围内的await就可以
            await match(state)
                .with(State.Fast, () => delay(100))
                .with(State.Auto, () => delay(2000 - store.config.AutoReadSpeed() * 2000))
                .otherwise(() => Promise.race([onClick(), onAuto(), onFast()]))
            log.info('已受到推动并结束等待')
        }
        // 调用jump命令修改接下来一幕的行号
        const jumpTarget = res['jump']
        if (Number.isFinite(jumpTarget)) row(jumpTarget)
        else row((i) => i + 1)
        // 调用end命令结束幕循环
        if (res['end'] === true) return Promise.resolve()
        // 当行号超出时,自动退出
        if (row() < book.length) return rec()
        else return Promise.resolve()
    })()
}

export { runAct, runLoop }
