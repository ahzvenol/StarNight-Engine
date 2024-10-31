import { once, range, throttle } from 'es-toolkit'
import { useReactive } from 'micro-reactive'
import { Component, JSX, createContext, createEffect, on, onMount, useContext } from 'solid-js'
import { router } from '@/router'
import { book } from '@/store/book'
import { useStore } from '@/store/context'
import { LocalSaveData } from '@/store/default'
import { Pages } from '@/ui/Pages'
import { useSignal } from '@/utils/Reactive'
import { Timer } from './Timer'
import { runLoop } from './act'
import { commands, hooks } from './commands'
import { bindClickEventWithKey, createEventDispatchers } from './event'
import { Events, GameContext, State, Variables } from './type'

export type GameUIElement = Function0<JSX.Element>

const EventsContext = createContext<Events>()
const VariablesContext = createContext<Variables>()
export const useEvents = () => useContext(EventsContext)!
export const useVariables = () => useContext(VariablesContext)!

// Game与UI做存档通信的插槽
export const slot = useReactive<LocalSaveData>({})

export const Core: Component<{ startAt: number; children: GameUIElement }> = ({ startAt, children }) => {
    startAt = 200

    const store = useStore()
    const row = useSignal(startAt)
    // tag:可能需要一些更复杂的分支预测机制
    // createEffect(() => preLoad(row() + 5))
    const clickLock = useSignal(false)
    const dispatchs = createEventDispatchers()

    // 0.1秒点击锁，防止过快点击
    const emitClickEvent = throttle(
        () => {
            if (!clickLock()) {
                dispatchs.click.publish()
            }
        },
        100,
        { edges: ['leading'] }
    )

    bindClickEventWithKey(emitClickEvent)

    const events: Events = {
        click: emitClickEvent,
        fast: dispatchs.fast.publish,
        auto: dispatchs.auto.publish
    }

    const state = useSignal(State.Normal)
    dispatchs.fast.subscribe(() => state(state() === State.Fast ? State.Normal : State.Fast))
    dispatchs.auto.subscribe(() => state(state() === State.Auto ? State.Normal : State.Auto))

    slot({})

    const variables: Variables = {
        temp: useReactive<LocalSaveData>({}),
        local: slot,
        global: store.save.global
    }

    const context: GameContext = { variables, store: store() }

    createEffect(
        on(
            router.active,
            () => {
                if (router.active() === Pages.Title) {
                    hooks.forEach((hook) => hook.onLeft?.(context))
                } else if (router.active() !== Pages.Game) {
                    hooks.forEach((hook) => hook.onDeactivated?.(context))
                } else {
                    hooks.forEach((hook) => hook.onActivated?.(context))
                }
            },
            { defer: true }
        )
    )

    const mount = once(async () => {
        // clickLock(true)
        const timer = new Timer()
        timer.toImmediate()
        hooks.forEach((hook) => hook.beforeInit?.(context))
        // const context = { timer, state: State.Init }
        // book.forEach(e => e.forEach(i => { if (i['@'] === 'sign') sign(i) }))
        range(0, startAt).forEach(async (row) =>
            (await book)[row].forEach((i) => commands[i['@']]?.({ row, timer, state: State.Init, ...context })(i))
        )
        // 初始化过程中有一些使用了Promise包装的命令,先让它们执行完毕再进行接下来的步骤
        setTimeout(() => hooks.forEach((hook) => hook.afterInit?.(context)))
        // 幕循环的第一次运行没有任何条件,所以不需要推动
        setTimeout(() => runLoop(row, state, store, variables, dispatchs.onClick, dispatchs.onAuto, dispatchs.onFast))
        // clickLock(false)
    })

    // solid-keep-alive + micro-reactive
    // 在设置页修改reactive变量之后会导致mount重复触发,所以务必用once包裹
    onMount(mount)

    return (
        <EventsContext.Provider value={events}>
            <VariablesContext.Provider value={variables}>{children()}</VariablesContext.Provider>
        </EventsContext.Provider>
    )
}
