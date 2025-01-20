import type { ReactiveStore } from '@/store/default'
import type { Signal } from '@/utils/Reactive'
import type { CommandEntitys } from './types/Command'
import type { InitialGameData, Variables } from './types/Game'
import { delay, range } from 'es-toolkit'
import { match } from 'ts-pattern'
import book from '@/store/book'
import { Y } from '@/utils/fp'
import { log } from '@/utils/logger'
import { PromiseState, PromiseX } from '@/utils/PromiseX'
import { useSignal } from '@/utils/Reactive'
import { Fork } from './commands/script/system/schedule'
import { isGameVisible } from './Core'
import {
    ActEndEvent,
    ActSecondClickEvent,
    ActStartEvent,
    JumpEvent,
    onActEnd,
    onAuto,
    onClick,
    onFast,
    onGameCleanup,
    onGameVisibilityChange,
    PostInitEvent,
    PreInitEvent
} from './event'
import { preloadWithIndex } from './preload'
import { GameState } from './types/Game'

// 对外暴露目前的index,目前供存档功能使用
export const currentIndex = useSignal(0)
ActStartEvent.subscribe((context) => currentIndex(context.index))

// 预加载游戏初始坐标后N幕资源
PostInitEvent.subscribe(({ index }) => {
    range(index, index + 5).forEach(preloadWithIndex)
})
// 预加载跳转目标后N幕资源
JumpEvent.subscribe(({ index }) => {
    range(index, index + 5).forEach(preloadWithIndex)
})
// 预加载本幕后第N幕的资源
ActStartEvent.subscribe(({ state, index }) => {
    if (state === GameState.Init) return
    preloadWithIndex(index + 5)
})

// 在一幕的效果没有全部执行完毕的情况下,第二次点击会加速本幕
// 如果本幕的命令都已经执行完成了,就可以解除对于第二次点击的监听
ActStartEvent.subscribe(async (context) => {
    const { immediate, state, cleanup } = context
    if (state === GameState.Init || state === GameState.Fast) return
    const immPromise = new PromiseX<'Fast' | 'Cancel'>()
    Promise.race([onClick(), onFast()]).then(() => immPromise.resolve('Fast'))
    Promise.race([onActEnd(), cleanup]).then(() => immPromise.resolve('Cancel'))
    const flag = await immPromise
    if (flag === 'Cancel') return
    ActSecondClickEvent.publish(context)
    ;(immediate as PromiseX<void>).resolve()
})

export function run(initial: InitialGameData, state: Signal<GameState>, store: ReactiveStore, variables: Variables) {
    PreInitEvent.publish()
    const cleanup = onGameCleanup()
    PostInitEvent.once(() => state(GameState.Normal))
    return Y<number, Promise<void>>((rec) => async (index) => {
        if (index === initial.index) PostInitEvent.publish({ index })
        const immediate = new PromiseX<void>()
        if (state() === GameState.Init || state() === GameState.Fast) immediate.resolve()
        const context = { initial, state: state(), store: store(), variables, index, immediate, cleanup }
        // ActStart
        ActStartEvent.publish(context)
        // 收集命令返回的运行数据,处理可能影响游戏流程的部分,如jump和continue
        const output = await Fork.apply(context)((await book.full(index)) as CommandEntitys[])
        // ActEnd
        ActEndEvent.publish(context)
        if (output['state']) state(output['state'])
        // 等待过程受continue命令影响
        if (state() !== GameState.Init && output['continue'] !== true) {
            // 有两种情况导致阻塞: 幕中的阻塞命令,等待点击事件
            // 点击自动按钮,不需要去加速正在运行的幕,但是需要去推动已经停止的循环
            await match(state())
                .with(GameState.Fast, () => delay(100))
                .with(GameState.Auto, () => delay(2000 - store.config.autoreadspeed() * 2000))
                .otherwise(() => Promise.race([onClick(), onAuto(), onFast()]))
            log.info('已受到推动并结束等待')
        }
        // 如果用户离开游戏界面,等待用户回来
        if (!isGameVisible()) await onGameVisibilityChange()
        // 游戏实例已销毁时退出
        const isCleanup = (await PromiseX.status(cleanup)) !== PromiseState.Pending
        // 通过end命令退出 || 超过最后一幕自动退出
        const isEnd = output['end'] === true || index >= (await book.length())
        if (isCleanup || isEnd) return Promise.resolve()
        // jump命令修改接下来一幕的index
        const jumpArg = output['jump']
        const isJump = typeof jumpArg === 'number' && isFinite(jumpArg)
        const next = isJump ? jumpArg : index + 1
        if (isJump) JumpEvent.publish({ index: jumpArg })
        return rec(next)
    })(0)
}
