import type { Reactive } from 'micro-reactive'
import type { Accessor, Component, ParentProps } from 'solid-js'
import type { GlobalSaveData } from '@/store/default'
import type { Events, Variables } from './types/Game'
import { once } from 'es-toolkit'
import { useReactive } from 'micro-reactive'
import { createContext, createEffect, on, onCleanup, onMount, useContext } from 'solid-js'
import { router } from '@/router'
import { useStore } from '@/store/context'
import { Content } from '@/ui/Elements'
import { GameInitialContext, Pages } from '@/ui/Pages'
import { log } from '@/utils/logger'
import { useSignal } from '@/utils/Reactive'
import {
    ActivateEvent,
    CleanupEvent,
    createButtonEventDispatchers,
    DeactivateEvent,
    LeaveEvent,
    MountEvent
} from './event'
import { runLoop } from './run'
import { GameState } from './types/Game'

// export type GameUIElement = Function0<JSX.Element>

const EventsContext = createContext<Events>()
const StateContext = createContext<Accessor<GameState>>()
const VariablesContext = createContext<Variables>()
export const useEvents = () => useContext(EventsContext)!
export const useState = () => useContext(StateContext)!
export const useVariables = () => useContext(VariablesContext)!

export const currentStage = useSignal<HTMLDivElement | null>(null)

export const Core: Component<ParentProps> = (props) => {
    const initialData = useContext(GameInitialContext)!

    const initialIndex = initialData.index

    log.info(`Game组件函数被调用`)
    log.info(`Game初始数据:`, initialData)

    const store = useStore()
    // tag:可能需要一些更复杂的分支预测机制
    // createEffect(() => preLoad(index() + 5))
    const dispatchs = createButtonEventDispatchers()

    const events: Events = {
        click: dispatchs.click.publish,
        fast: dispatchs.fast.publish,
        auto: dispatchs.auto.publish
    }

    const state = useSignal(GameState.Init)
    dispatchs.auto.subscribe(() => state(state() === GameState.Auto ? GameState.Normal : GameState.Auto))
    dispatchs.fast.subscribe(() => state(state() === GameState.Fast ? GameState.Normal : GameState.Fast))

    const variables: Variables = {
        temp: useReactive<Record<string, unknown>>({}),
        // local: slot,
        global: store.save.global as Reactive<GlobalSaveData>
    }

    createEffect(
        on(
            router.active,
            () => {
                if (router.active() === Pages.Title) {
                    LeaveEvent.publish()
                } else if (router.active() !== Pages.Game) {
                    DeactivateEvent.publish()
                } else {
                    ActivateEvent.publish()
                }
            },
            { defer: true }
        )
    )

    onCleanup(CleanupEvent.publish)

    onMount(MountEvent.publish)

    // micro-reactive有Bug,如果遇到奇怪的递归就是它的锅
    onMount(
        once(() =>
            runLoop(initialIndex, state, store, variables, dispatchs.onClick, dispatchs.onAuto, dispatchs.onFast)
        )
    )

    return (
        <EventsContext.Provider value={events}>
            <StateContext.Provider value={state}>
                <VariablesContext.Provider value={variables}>
                    <Content ref={(ref) => currentStage(ref)}>{props.children}</Content>
                </VariablesContext.Provider>
            </StateContext.Provider>
        </EventsContext.Provider>
    )
}
