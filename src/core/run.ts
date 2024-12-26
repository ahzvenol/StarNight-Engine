import type { ReactiveStore, Store } from '@/store/default'
import type { Signal } from '@/utils/Reactive'
import type { GameRuntimeContext, Variables } from './types/Game'
import { delay } from 'es-toolkit'
import { match } from 'ts-pattern'
import book from '@/store/book'
import { Y } from '@/utils/fp'
import { log } from '@/utils/logger'
import { PromiseX } from '@/utils/PromiseX'
import { useSignal } from '@/utils/Reactive'
import {
    ActEndEvent,
    ActivatedEvent,
    ActSecondClickEvent,
    ActStartEvent,
    DeactivatedEvent,
    onActEnd,
    onDestoryed
} from './event'
import { fork } from './flow'
import { act } from './old act'
import { GameState } from './types/Game'
import { Timer } from './utils/Timer'

// 对外暴露目前的index,目前供存档功能使用
export const currentIndex = useSignal(0)
ActStartEvent.subscribe((context) => currentIndex(context.index))

// 循环监听Deactivated和Activated事件以暂停/启动timer,直到本幕结束监听取消
ActStartEvent.subscribe(({ timer }) => {
    const id1 = DeactivatedEvent.subscribe(timer.pause)
    const id2 = ActivatedEvent.subscribe(timer.start)
    Promise.race([onActEnd(), onDestoryed()]).then(() => {
        DeactivatedEvent.unsubscribe(id1)
        ActivatedEvent.unsubscribe(id2)
    })
})

// 给予全部命令操作actindex的能力是危险的,有几个特殊的命令会影响主循环,可以单独提出
async function runAct(
    index: number,
    state: GameState,
    store: Store,
    variables: Variables,
    onClick: Promise<void>,
    onFast: Promise<void>
) {
    const timer = new Timer()
    // 如果现在是快进状态,直接把timer设置到立即执行
    if (state == GameState.Fast) timer.toImmediate()
    const context: GameRuntimeContext = { timer, state, store, variables, index, destory: onDestoryed() }
    // 在一幕的效果没有全部执行完毕的情况下,第二次点击会加速本幕,通过timer立即执行全部效果
    // 如果没有特殊阻塞,调用timer.toImmediate后会将promise链推进至actEnd
    const immPromise = new PromiseX()
    immPromise
        .then(() => ActSecondClickEvent.publish(context))
        .then(timer.toImmediate)
        // 忽略调用reject导致的报错
        .catch((e) => {
            if (e !== undefined) log.error('Timer.toImmediate出错', e)
        })
    Promise.race([onClick, onFast]).then(immPromise.resolve)
    // act start
    ActStartEvent.publish(context)
    // 收集命令返回的运行数据,处理可能影响游戏流程的部分,如jump和continue
    const commandOutput = await fork(await act(index, context))()
    // 如果本幕的命令都已经执行完成了,就可以解除对于第二次点击的监听
    immPromise.reject()
    ActEndEvent.publish(context)
    return commandOutput
}

function runLoop(
    index: Signal<number>,
    state: Signal<GameState>,
    store: ReactiveStore,
    variables: Variables,
    onClick: Function0<Promise<void>>,
    onAuto: Function0<Promise<void>>,
    onFast: Function0<Promise<void>>
) {
    return Y<void, Promise<void>>((rec) => async () => {
        // 幕运行过程中不会操作任何状态,但可以操作variables
        const res = await runAct(index(), state(), store(), variables, onClick(), onFast())
        // 等待过程受continue命令影响
        if (res['continue'] !== true) {
            // 只有两个地方会有阻塞:正在运行一幕,等待点击事件
            // 为了更清晰的表示,用Promise.race同时监听几个事件来推进幕循环
            // auto的话,不需要去加速正在运行的幕,但是需要去推动已经停止的循环
            // 像是选项要卡死幕循环的情况,使用不在timer控制范围内的await就可以
            await match(state())
                .with(GameState.Fast, () => delay(100))
                .with(GameState.Auto, () => delay(2000 - store.config.autoreadspeed() * 2000))
                .otherwise(() => Promise.race([onClick(), onAuto(), onFast()]))
            log.info('已受到推动并结束等待')
        }
        // 调用jump命令修改接下来一幕的行号
        const jumpTarget = res['jump']
        if (Number.isFinite(jumpTarget)) {
            index(jumpTarget as number)
        } else index((i) => i + 1)
        // 调用end命令结束幕循环
        if (res['end'] === true) return Promise.resolve()
        // 当行号超出时,自动退出
        if (index() < (await book.length())) return rec()
        else return Promise.resolve()
    })()
}

export { runAct, runLoop }
