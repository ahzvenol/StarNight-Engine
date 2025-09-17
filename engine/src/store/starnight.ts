import type { GameConstructorParams, StarNightInstance } from '@starnight/core'
import { StarNight } from '@starnight/core'
import { useReactive, useSignal } from 'micro-reactive-solid'
import { ScenarioDSL } from '@/scenario/ScenarioDSL'
import { useGame } from '@/ui/GameRoot'
import { isDevelopment } from '@/utils/checkEnv'
import { BGM, SE, Clip } from './audio'
import { onStoreReady } from '.'

StarNight.useReactive = useReactive

export const starnight = useSignal<StarNightInstance>(null as unknown as StarNightInstance)

export const ui = () => starnight().context.ui

export const entry = import('./scenario').then((mod) => mod.entry)

export const debug = import('./scenario').then((mod) => mod.debug)

export const script = async () => ScenarioDSL(await entry, await debug)

export const instance = async (local: GameConstructorParams['local']) => {
    const { config, global } = await onStoreReady
    const view = document.createElement('canvas')
    Object.assign(view, { width: 1280, height: 720 })
    return StarNight.instance({
        script: await script(), config, local, global,
        ui: {
            view, audio: { bgm: BGM, se: SE, clip: Clip }
        }
    })
}

// 如果处在调试模式,直接进入游戏页
debug.then((isDebug) => { if (isDebug) useGame({ count: 1 }) })

// 如果处在开发环境,输出控制台日志
if (isDevelopment()) {
    StarNight.GameEvents.start.subscribe(({ instance: { uuid } }) => console.time(uuid))
    StarNight.GameEvents.ready.subscribe(({ instance: { uuid } }) => console.timeEnd(uuid))

    StarNight.GameEvents.start.subscribe(() => console.info('Game:游戏开始'))
    StarNight.GameEvents.end.subscribe(() => console.info('Game:游戏结束'))
    StarNight.GameEvents.stop.subscribe(() => console.info('Game:游戏终止'))
    StarNight.GameEvents.exit.subscribe(() => console.info('Game:游戏退出'))
    StarNight.GameEvents.suspend.subscribe(() => console.info('Game:游戏挂起'))
    StarNight.GameEvents.resume.subscribe(() => console.info('Game:游戏从挂起中恢复'))
    StarNight.GameEvents.active.subscribe((active) => console.info(`Game:游戏活动状态:${active}`))
    StarNight.GameEvents.ready.subscribe(() => console.info(`Game:初始化完成`))

    StarNight.ActEvents.start.subscribe(({ state, current: { count: index } }) => {
        if (state.isInitializing()) {
            console.info(`Act:开始初始化第${index()}幕...`)
        } else {
            console.info(`Act:开始执行第${index()}幕...`)
        }
    })
    StarNight.ActEvents.end.subscribe(({ state, current: { count: index } }) => {
        if (!state.isInitializing()) console.info(`Act:第${index()}幕执行结束`)
    })
    StarNight.ActEvents.rush.subscribe(({ state }) => {
        if (!state.isInitializing()) console.info('Act:执行单幕快进')
    })
    StarNight.ActEvents.next.subscribe(({ current: { count: index }, instance: { state } }) => {
        if (!state.isInitializing()) console.info(`Act:准备执行第${index()}幕`)
    })

    StarNight.ClickEvents.step.subscribe(() => console.info('ClickEvent:触发点击事件'))
    StarNight.ClickEvents.fast.subscribe(() => console.info('ClickEvent:触发快进/解除快进事件'))
    StarNight.ClickEvents.auto.subscribe(() => console.info('ClickEvent:触发自动/解除自动事件'))
}
