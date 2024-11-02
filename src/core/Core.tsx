import type { Accessor, Component, ParentProps } from 'solid-js'
import type { LocalSaveData } from '@/store/default'
import type { Events, GameContext, Variables } from './type'
import { useReactive } from 'micro-reactive'
import { createContext, createEffect, on, onMount, useContext } from 'solid-js'
import { router } from '@/router'
import book from '@/store/book'
import systemDefaultStore from '@/store/default'
import { Pages } from '@/ui/Pages'
import { log } from '@/utils/Logger'
import { useSignal } from '@/utils/Reactive'
import { runLoop } from './act'
import { commands, hooks } from './commands'
import { createEventDispatchers } from './event'
import { Timer } from './Timer'
import { State } from './type'

// export type GameUIElement = Function0<JSX.Element>

const EventsContext = createContext<Events>()
const StateContext = createContext<Accessor<State>>()
const VariablesContext = createContext<Variables>()
export const useEvents = () => useContext(EventsContext)!
export const useState = () => useContext(StateContext)!
export const useVariables = () => useContext(VariablesContext)!

// Core与UI做存档通信的插槽
export const slot = useReactive<LocalSaveData>({})

export const Core: Component<ParentProps<{ startAt: number }>> = (props) => {
    console.log('Core')

    const startAt = props.startAt
    // startAt = 1
    // const store = useStore()
    const store = useReactive(systemDefaultStore)

    const index = useSignal(props.startAt)
    // tag:可能需要一些更复杂的分支预测机制
    // createEffect(() => preLoad(index() + 5))
    const dispatchs = createEventDispatchers()

    const events: Events = {
        click: dispatchs.click.publish,
        fast: dispatchs.fast.publish,
        auto: dispatchs.auto.publish
    }

    const state = useSignal(State.Normal)
    dispatchs.auto.subscribe(() => state(state() === State.Auto ? State.Normal : State.Auto))
    dispatchs.fast.subscribe(() => state(state() === State.Fast ? State.Normal : State.Fast))

    slot({})

    const variables: Variables = {
        // temp: useReactive<LocalSaveData>({}),
        // local: slot,
        // global: store.save.global as Reactive<GlobalSaveData>
    }

    const context: GameContext = { variables, store: store() }

    createEffect(
        on(
            router.active,
            () => {
                if (router.active() === Pages.Title) {
                    log.info('Game:用户回到标题页')
                    hooks.forEach((hook) => hook.onLeft?.(context))
                } else if (router.active() !== Pages.Game) {
                    log.info('Game:用户离开游戏页面')
                    hooks.forEach((hook) => hook.onDeactivated?.(context))
                } else {
                    log.info('Game:用户回到游戏页面')
                    hooks.forEach((hook) => hook.onActivated?.(context))
                }
            },
            { defer: true }
        )
    )

    onMount(async () => {
        const timer = new Timer()
        timer.toImmediate()
        hooks.forEach((hook) => hook.beforeInit?.(context))
        // const context = { timer, state: State.Init }
        // book.forEach(e => e.forEach(i => { if (i['@'] === 'sign') sign(i) }))
        let i = 0
        while (i < startAt) {
            ;(await book.row(i)).forEach((args) =>
                commands[args['@']]?.({ index: i, timer, state: State.Init, ...context })(args)
            )
            log.info(`正在初始化第${i}幕`)
            i += 1
        }
        // 初始化过程中有一些使用了Promise包装的命令,先让它们执行完毕再进行接下来的步骤
        setTimeout(() => hooks.forEach((hook) => hook.afterInit?.(context)))
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
