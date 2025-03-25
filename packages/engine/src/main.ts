import type { CommandEntities } from './types/Command'
import type { GameLocalData, GameStartOptions } from './types/Game'
import { delay, isString, noop } from 'es-toolkit'
import { Fork } from './commands/system/schedule'
import {
    ActEndEvent,
    ActJumpEvent,
    ActSecondClickEvent,
    ActStartEvent,
    AutoButtonClickEvent,
    FastButtonClickEvent,
    GameInitCompleteEvent,
    GameVisibilityEvent,
    onActEnd,
    onAuto,
    onClick,
    onFast,
    onGameDestroy,
    onGameVisibilityChange
} from './Event'
import { SetupConfig } from './Setup'
import { GameState } from './types/Game'
import { PromiseX } from './utils/PromiseX'
import { RangeSet } from './utils/RangeSet'
import { useActScopeSignal, useGameScopeReactive, useGameScopeSignal } from './utils/useScopeSignal'

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
export async function run({ book, local, global }: GameStartOptions) {
    console.time()
    const index = current.index
    const destroy = onGameDestroy()
    const config = await SetupConfig
    const readsegment = global.readsegment
    GameInitCompleteEvent.once(() => console.timeEnd())
    GameInitCompleteEvent.once(() => state(GameState.Normal))
    AutoButtonClickEvent.subscribe(() => state(state() === GameState.Auto ? GameState.Normal : GameState.Auto))
    FastButtonClickEvent.subscribe(() => state(state() === GameState.Fast ? GameState.Normal : GameState.Fast))
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (index() === local.index) GameInitCompleteEvent.publish({ index: index() })
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
        const output = await Fork.apply(context)(book.act(index()) as CommandEntities[])
        // ActEnd
        ActEndEvent.publish(context)
        if (output['state'] && state() !== GameState.Init) state(output['state'])
        // 等待过程受continue命令影响
        if (state() !== GameState.Init && output['continue'] !== true) {
        } else if (state() === GameState.Fast) {
            await delay(config.fastreadspeed())
        } else if (state() === GameState.Auto) {
            await delay(config.autoreadspeed())
        } else {
            await Promise.race([onClick(), onAuto(), onFast()])
        }
        // 如果用户离开游戏界面,等待用户回来
        if (!isGameVisible()) await onGameVisibilityChange()
        // jump命令修改接下来一幕的index
        const jump = output['jump']
        const target = isString(jump) ? book.label(jump) : typeof jump === 'number' && isFinite(jump) ? jump : undefined
        index(target !== undefined ? target : index() + 1)
        // 游戏实例已销毁时退出,初始化时不判断以优化初始化速度
        const isCleanup = state() !== GameState.Init && (await PromiseX.isSettled(destroy))
        // 通过end命令退出 || 超过最后一幕自动退出
        const isEnd = output['end'] === true || index() >= book.length()
        if (isEnd) return Promise.resolve()
        if (isCleanup) return new Promise(noop)
        if (target !== undefined) ActJumpEvent.publish({ index: target })
    }
}
