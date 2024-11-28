import type { Reactive } from 'micro-reactive'
import type { Accessor, Component, ParentProps } from 'solid-js'
import type { GlobalSaveData } from '@/store/default'
import type { Events, GameContext, Variables } from './types/Game'
import { useReactive } from 'micro-reactive'
import { createContext, createEffect, on, onCleanup, onMount, useContext } from 'solid-js'
import { router } from '@/router'
import { useStore } from '@/store/context'
import { Pages } from '@/ui/Pages'
import { log } from '@/utils/Logger'
import { useSignal } from '@/utils/Reactive'
import { runLoop } from './act'
import {
    ActivatedEvent,
    createButtonEventDispatchers,
    DeactivatedEvent,
    DestoryedEvent,
    LeftEvent,
    PostInitEvent,
    PreInitEvent
} from './event'
import { row } from './row'
import { State } from './types/Game'
import { Timer } from './utils/Timer'

// export type GameUIElement = Function0<JSX.Element>

const EventsContext = createContext<Events>()
const StateContext = createContext<Accessor<State>>()
const VariablesContext = createContext<Variables>()
export const useEvents = () => useContext(EventsContext)!
export const useState = () => useContext(StateContext)!
export const useVariables = () => useContext(VariablesContext)!

export const initData = useSignal({ index: 1 })

export const Core: Component<ParentProps> = (props) => {
    console.log(initData())

    const startAt = initData().index
    // startAt = 1
    const store = useStore()

    const index = useSignal(startAt)
    // tag:可能需要一些更复杂的分支预测机制
    // createEffect(() => preLoad(index() + 5))
    const dispatchs = createButtonEventDispatchers()

    const events: Events = {
        click: dispatchs.click.publish,
        fast: dispatchs.fast.publish,
        auto: dispatchs.auto.publish
    }

    const state = useSignal(State.Normal)
    dispatchs.auto.subscribe(() => state(state() === State.Auto ? State.Normal : State.Auto))
    dispatchs.fast.subscribe(() => state(state() === State.Fast ? State.Normal : State.Fast))

    const variables: Variables = {
        temp: useReactive<Record<string, unknown>>({}),
        // local: slot,
        global: store.save.global as Reactive<GlobalSaveData>
    }

    const context: GameContext = { variables, store: store }

    createEffect(
        on(
            router.active,
            () => {
                if (router.active() === Pages.Title) {
                    log.info('Game:用户回到标题页')
                    LeftEvent.publish()
                } else if (router.active() !== Pages.Game) {
                    log.info('Game:用户离开游戏页面')
                    DeactivatedEvent.publish()
                } else {
                    log.info('Game:用户回到游戏页面')
                    ActivatedEvent.publish()
                }
            },
            { defer: true }
        )
    )

    onCleanup(() => {
        log.info('Game:组件销毁')
        DestoryedEvent.publish()
    })

    onMount(async () => {
        log.info('Game:组件挂载')
        const timer = new Timer()
        timer.toImmediate()
        PreInitEvent.publish()
        // const context = { timer, state: State.Init }
        // book.forEach(e => e.forEach(i => { if (i['@'] === 'sign') sign(i) }))
        let i = 0
        while (i < startAt) {
            ;(await row(i, { index: i, timer, state: State.Init, ...context })).forEach((e) => e.apply())
            // log.info(`正在初始化第${i}幕`)
            i += 1
        }
        // 初始化过程中有一些使用了Promise包装的命令,先让它们执行完毕再进行接下来的步骤
        setTimeout(PostInitEvent.publish)
        // 幕循环的第一次运行没有任何条件,所以不需要推动
        setTimeout(() => runLoop(index, state, store, variables, dispatchs.onClick, dispatchs.onAuto, dispatchs.onFast))
    })

    return (
        <EventsContext.Provider value={events}>
            <StateContext.Provider value={state}>
                <VariablesContext.Provider value={variables}>{props.children}</VariablesContext.Provider>
            </StateContext.Provider>
        </EventsContext.Provider>
    )
}
