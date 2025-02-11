import type { Reactive } from 'micro-reactive'
import type { Accessor, Component, ParentProps } from 'solid-js'
import type { GlobalSaveData } from '@/store/default'
import type { Variables } from './types/Game'
import { useReactive } from 'micro-reactive'
import { createContext, onCleanup, onMount, useContext } from 'solid-js'
import { useStore } from '@/store/context'
import { Content } from '@/ui/Elements'
import { GameInitialContext } from '@/ui/Pages'
import { log } from '@/utils/logger'
import { useSignal } from '@/utils/solid/useSignal'
import {
    AutoButtonClickEvent,
    FastButtonClickEvent,
    GameCleanupEvent,
    GameMountEvent,
    GameVisibilityEvent
} from './event'
import { run } from './run'
import { GameState } from './types/Game'
import { useGameScopeSignal } from './utils/useScopeSignal'

export const isGameVisible = useGameScopeSignal(true)
GameVisibilityEvent.subscribe((visible) => isGameVisible(visible))

const StateContext = createContext<Accessor<GameState>>()
const VariablesContext = createContext<Variables>()
export const useState = () => useContext(StateContext)!
export const useVariables = () => useContext(VariablesContext)!

export const currentStage = useSignal<HTMLDivElement | null>(null)

export const Core: Component<ParentProps> = (props) => {
    log.info(`Game组件函数被调用`)

    const initial = useContext(GameInitialContext)!

    log.info(`Game初始数据:`, initial)

    const store = useStore()

    const state = useSignal(GameState.Init)
    AutoButtonClickEvent.subscribe(() => state(state() === GameState.Auto ? GameState.Normal : GameState.Auto))
    FastButtonClickEvent.subscribe(() => state(state() === GameState.Fast ? GameState.Normal : GameState.Fast))

    const variables: Variables = {
        temp: useReactive<Record<string, unknown>>({}),
        // local: slot,
        global: store.save.global as Reactive<GlobalSaveData>
    }

    onCleanup(GameCleanupEvent.publish)

    onMount(GameMountEvent.publish)

    onMount(() => run(initial, state, store, variables))

    return (
        <StateContext.Provider value={state}>
            <VariablesContext.Provider value={variables}>
                <Content ref={(ref) => currentStage(ref)}>{props.children}</Content>
            </VariablesContext.Provider>
        </StateContext.Provider>
    )
}
