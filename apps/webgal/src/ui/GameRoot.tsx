import type { GameLocalData } from '@starnight/core'
import type { Component } from 'solid-js'
import { StarNight } from '@starnight/core'
import { useSignal } from 'micro-reactive-solid'
import { createEffect, on, onCleanup, Show } from 'solid-js'
import { Transition } from 'solid-transition-group'
import { Content } from '@/core/ui/Elements'
import { onStoreReady } from '@/store'
import { book, starnight } from '@/store/starnight'
import { Backlog } from '@/ui/Game/Backlog'
import Game from '@/ui/Game/Game'
import styles from '@/ui/Game/Game.module.scss'
import { stopPropagation } from '@/utils/solid/stopPropagation'
import { useEventListener } from '@/utils/solid/useEventListener'
import { BGM, Clip, SE, UISE } from '../store/audio'
import Config from './Config/Config'
import { GUIRootState } from './GUIRoot'
import Menu from './Menu/Menu'
import SaveLoad from './SaveAndLoad/SaveLoad'
import '@/core/effect/preload'

export type GUIGameRootPages = 'Game' | 'Config' | 'Save' | 'Load' | 'Backlog'

export const GUIGameRootState = useSignal<GUIGameRootPages>('Game')

// 结束游戏回到标题页
StarNight.GameEvents.end.subscribe(() => GUIRootState('Home'))

// 自动存档
StarNight.ActEvents.start.subscribe(async ({ state, current }) => {
    const store = await onStoreReady
    if (!state.isAuto() && !state.isFast()) {
        store.local[0](current())
    }
})

export const GameRoot: Component = () => {
    GUIGameRootState('Game')

    // 在游戏页面离开标签页时暂停游戏,回到标签页时恢复
    useEventListener('visibilitychange', () =>
        document.visibilityState === 'hidden' ? starnight().suspend() : starnight().resume()
    )

    // 在游戏页面离开游戏页时暂停自动和快进,在离开此页面时恢复
    createEffect(
        on(
            GUIGameRootState,
            (prev) => {
                if (prev === 'Game') {
                    if (starnight().state.isAuto()) {
                        starnight().ClickEvents.auto.publish()
                        onCleanup(() => {
                            starnight().ClickEvents.auto.publish()
                        })
                    } else if (starnight().state.isFast()) {
                        starnight().ClickEvents.fast.publish()
                        onCleanup(() => {
                            starnight().ClickEvents.auto.publish()
                        })
                    }
                }
            },
            { defer: true }
        )
    )

    // 离开游戏页面时销毁游戏实例
    onCleanup(() => starnight().stop())

    return (
        <>
            <Show when={starnight} keyed>
                <Game />
            </Show>
            <Content ref={stopPropagation('contextmenu')} onContextMenu={() => GUIGameRootState('Game')}>
                <Show when={['Config', 'Save', 'Load'].includes(GUIGameRootState())}>
                    <Menu>
                        <Show when={GUIGameRootState() === 'Config'}>
                            <Config />
                        </Show>
                        <Show when={GUIGameRootState() === 'Save'}>
                            <SaveLoad mode="Save" />
                        </Show>
                        <Show when={GUIGameRootState() === 'Load'}>
                            <SaveLoad mode="Load" />
                        </Show>
                    </Menu>
                </Show>
                <Transition enterToClass={styles.Game_Backlog_in} exitToClass={styles.Game_Backlog_out}>
                    <Show when={GUIGameRootState() === 'Backlog'}>
                        <Backlog />
                    </Show>
                </Transition>
            </Content>
        </>
    )
}

export const useGame = async (local: GameLocalData) => {
    starnight()?.stop()
    const store = await onStoreReady
    starnight(
        StarNight.instance({
            book: await book,
            config: store.config,
            local: local,
            global: store.global,
            ui: { audiotracks: { BGM, SE, Clip, UISE } }
        })
    )
    GUIRootState('Game')
    GUIGameRootState('Game')
    starnight().start()
}
