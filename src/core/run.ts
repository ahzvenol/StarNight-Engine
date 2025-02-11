import type { ReactiveStore } from '@/store/default'
import type { Signal } from '@/utils/solid/useSignal'
import type { CommandEntitys } from './types/Command'
import type { InitialGameData, Variables } from './types/Game'
import { delay, range } from 'es-toolkit'
import { match } from 'ts-pattern'
import { router } from '@/router'
import book from '@/store/book'
import { Pages } from '@/ui/Type'
import { isDevelopment, isNative } from '@/utils/checkEnv'
import { log } from '@/utils/logger'
import { PromiseState, PromiseX } from '@/utils/PromiseX'
import { useSignal } from '@/utils/solid/useSignal'
import { RangeSet } from '@/utils/zipNumArray'
import { Chain, Fork } from './commands/script/system/schedule'
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
import { getSave } from './save'
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

// 由幕循环维护已读幕
export const isRead = useSignal(false)

// 在循环开始前预取book.fulls会使快速读档变得很慢,由此换取10%的加载速度提升是不值得的
export async function run(
    initial: InitialGameData,
    state: Signal<GameState>,
    store: ReactiveStore,
    variables: Variables
) {
    let index = 0
    console.time()
    PreInitEvent.publish()
    const cleanup = onGameCleanup()
    const readsegment = variables.global.readsegment
    PostInitEvent.once(() => console.timeEnd())
    PostInitEvent.once(() => state(GameState.Normal))
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (index === initial.index) PostInitEvent.publish({ index })
        const range = RangeSet.fromRanges(readsegment())
        isRead(range.includes(index))
        if (!isRead()) readsegment(range.push(index).getRanges())
        if (state() === GameState.Fast && !store.config.fastforwardunread() && !isRead()) state(GameState.Normal)
        const immediate = new PromiseX<void>()
        if (state() === GameState.Init || state() === GameState.Fast) immediate.resolve()
        const context = { initial, state: state(), store: store(), variables, index, immediate, cleanup }
        // ActStart
        ActStartEvent.publish(context)
        // 收集命令返回的运行数据,处理可能影响游戏流程的部分,如jump和continue
        const output =
            state() === GameState.Init
                ? await Chain.apply(context)((await book.flat(index)) as CommandEntitys[])
                : await Fork.apply(context)((await book.full(index)) as CommandEntitys[])
        // ActEnd
        ActEndEvent.publish(context)
        if (output['state'] && state() !== GameState.Init) state(output['state'])
        if (state() !== GameState.Init && state() !== GameState.Fast) store.save.local[0](getSave('full'))
        // 等待过程受continue命令影响
        if (state() !== GameState.Init && output['continue'] !== true) {
            // 有两种情况导致阻塞: 幕中的阻塞命令,等待点击事件
            // 点击自动按钮,不需要去加速正在运行的幕,但是需要去推动已经停止的循环
            await match(state())
                .with(GameState.Fast, () => delay(isNative() || isDevelopment() ? 10 : 100))
                .with(GameState.Auto, () => delay(2000 - store.config.autoreadspeed() * 2000))
                .otherwise(() => Promise.race([onClick(), onAuto(), onFast()]))
            log.info('已受到推动并结束等待')
        }
        // 如果用户离开游戏界面,等待用户回来
        if (!isGameVisible()) await onGameVisibilityChange()
        // jump命令修改接下来一幕的index
        const jumpArg = output['jump']
        const isJump = typeof jumpArg === 'number' && isFinite(jumpArg)
        index = isJump ? jumpArg : index + 1
        // 游戏实例已销毁时退出
        const isCleanup = state() !== GameState.Init && (await PromiseX.status(cleanup)) !== PromiseState.Pending
        // 通过end命令退出 || 超过最后一幕自动退出
        const isEnd = output['end'] === true || index >= (await book.length())
        if (isCleanup || isEnd) break
        if (isJump) JumpEvent.publish({ index: jumpArg })
    }
    const isCleanup = (await PromiseX.status(cleanup)) !== PromiseState.Pending
    // 如果是通过End方式结束幕循环,就返回主界面
    if (!isCleanup) router.navigate(Pages.Title)
}
