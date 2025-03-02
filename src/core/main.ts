import type { CommandEntitys } from './types/Command'
import type { GameLocalData, GameStartOptions } from './types/Game'
import { delay, isString, noop, range } from 'es-toolkit'
import { match } from 'ts-pattern'
import { isDevelopment, isNative } from '@/utils/checkEnv'
import { Option } from '@/utils/fp/Option'
import { log } from '@/utils/logger'
import { PromiseState, PromiseX } from '@/utils/PromiseX'
import { useSignal } from '@/utils/solid/useSignal'
import { RangeSet } from '@/utils/zipNumArray'
import { Fork } from './commands/script/system/schedule'
import {
    ActEndEvent,
    ActSecondClickEvent,
    ActStartEvent,
    AutoButtonClickEvent,
    FastButtonClickEvent,
    GameDestroyEvent,
    GameStartEvent,
    GameVisibilityEvent,
    InitCompleteEvent,
    JumpEvent,
    onActEnd,
    onAuto,
    onClick,
    onFast,
    onGameDestroy,
    onGameVisibilityChange
} from './event'
import { preloadWithIndex } from './preload'
import { GameState } from './types/Game'
import { useActScopeSignal, useGameScopeReactive, useGameScopeSignal } from './utils/useScopeSignal'

// 预加载游戏初始坐标后N幕资源
InitCompleteEvent.subscribe(({ index }) => {
    range(index, index + 5).forEach(preloadWithIndex)
})
// 预加载跳转目标后N幕资源
JumpEvent.subscribe(({ index }) => {
    range(index, index + 5).forEach(preloadWithIndex)
})
// 预加载本幕后第N幕的资源
ActStartEvent.subscribe(({ state, current: { index } }) => {
    if (state !== GameState.Init) preloadWithIndex(index() + 5)
})

// 在一幕的效果没有全部执行完毕的情况下,第二次点击会加速本幕
// 如果本幕的命令都已经执行完成了,就可以解除对于第二次点击的监听
ActStartEvent.subscribe(async (context) => {
    const { state, immediate, destroy } = context
    if (state === GameState.Init || state === GameState.Fast) return
    const immPromise = new PromiseX<'Fast' | 'Cancel'>()
    Promise.race([onClick(), onFast()]).then(() => immPromise.resolve('Fast'))
    Promise.race([onActEnd(), destroy]).then(() => immPromise.resolve('Cancel'))
    const flag = await immPromise
    if (flag === 'Cancel') return
    ActSecondClickEvent.publish(context)
    ;(immediate as PromiseX<void>).resolve()
})

export const isGameVisible = useGameScopeSignal(true)
GameVisibilityEvent.subscribe((visible) => isGameVisible(visible))

// 已读/未读标记
export const isRead = useActScopeSignal(false)

// 游戏状态
export const state = useGameScopeSignal(GameState.Init)
export const current = useGameScopeReactive<GameLocalData>(() => ({ index: 1 }))

// 在循环开始前预取book.fulls会使快速读档变得很慢,由此换取10%的加载速度提升是不值得的
export async function start({ local, global, config, book }: GameStartOptions) {
    console.time()
    GameStartEvent.publish()
    const index = current.index
    const destroy = onGameDestroy()
    const readsegment = global.readsegment
    InitCompleteEvent.once(() => console.timeEnd())
    InitCompleteEvent.once(() => state(GameState.Normal))
    AutoButtonClickEvent.subscribe(() => state(state() === GameState.Auto ? GameState.Normal : GameState.Auto))
    FastButtonClickEvent.subscribe(() => state(state() === GameState.Fast ? GameState.Normal : GameState.Fast))
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (index() === local.index()) InitCompleteEvent.publish({ index: index() })
        // 由幕循环维护已读幕,这一操作需要在ActStart之前完成,所以不能借助事件
        const range = RangeSet.fromRanges(readsegment())
        isRead(range.includes(index()))
        if (!isRead()) readsegment(range.push(index()).getRanges())
        // 处理在未读文本处解除快进的设置项
        if (state() === GameState.Fast && !config.fastforwardunread() && !isRead()) state(GameState.Normal)
        // ActStart前的初始化工作
        const immediate = new PromiseX<void>()
        if (state() === GameState.Init || state() === GameState.Fast) immediate.resolve()
        const context = { current, config, global, local, state: state(), immediate, destroy }
        // ActStart
        ActStartEvent.publish(context)
        // 收集命令返回的运行数据,处理可能影响游戏流程的部分,如jump和continue
        const output = await Fork.apply(context)((await book.act(index())) as CommandEntitys[])
        // ActEnd
        ActEndEvent.publish(context)
        if (output['state'] && state() !== GameState.Init) state(output['state'])
        // 等待过程受continue命令影响
        if (state() !== GameState.Init && output['continue'] !== true) {
            // 有两种情况导致阻塞: 幕中的阻塞命令,等待点击事件
            // 点击自动按钮,不需要去加速正在运行的幕,但是需要去推动已经停止的循环
            await match(state())
                .with(GameState.Fast, () => delay(isNative() || isDevelopment() ? 10 : 100))
                .with(GameState.Auto, () => delay(2000 - config.autoreadspeed() * 2000))
                .otherwise(() => Promise.race([onClick(), onAuto(), onFast()]))
            log.info('已受到推动并结束等待')
        }
        // 如果用户离开游戏界面,等待用户回来
        if (!isGameVisible()) await onGameVisibilityChange()
        // jump命令修改接下来一幕的index
        const jump = isString(output['jump'])
            ? Option.some(await book.label(output['jump']))
            : typeof output['jump'] === 'number' && isFinite(output['jump'])
              ? Option.some(output['jump'])
              : Option.none<number>()
        index(jump.isDefined() ? jump.get() : index() + 1)
        // 游戏实例已销毁时退出,初始化时不判断以优化初始化速度
        const isCleanup = state() !== GameState.Init && (await PromiseX.status(destroy)) !== PromiseState.Pending
        // 通过end命令退出 || 超过最后一幕自动退出
        const isEnd = output['end'] === true || index() >= (await book.length())
        if (isEnd) return Promise.resolve()
        if (isCleanup) return new Promise(noop)
        if (jump.isDefined()) JumpEvent.publish({ index: jump.get() })
    }
}

export function destroy() {
    GameDestroyEvent.publish()
}
