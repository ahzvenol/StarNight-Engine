import type { GameConstructorParams } from '@starnight/core'
import type { Component } from 'solid-js'
import { StarNight } from '@starnight/core'
import { useSignal } from 'micro-reactive-solid'
import { createEffect, on, onCleanup, Show } from 'solid-js'
import { Transition } from 'solid-transition-group'
import { Content } from '@/utils/ui/Elements'
import { onStoreReady } from '@/store'
import { instance, starnight } from '@/store/starnight'
import { Backlog } from '@/ui/Game/Backlog'
import { Game } from '@/ui/Game/Game'
import styles from '@/ui/Game/Game.module.scss'
import { suppress } from '@/utils/solid/suppress'
import { useEventListener } from '@/utils/solid/useEventListener'
import { Config } from './Config/Config'
import { GUIRootState } from './GUIRoot'
import { Menu } from './Menu/Menu'
import { SaveLoad } from './SaveAndLoad/SaveLoad'

export type GUIGameRootPages = 'Game' | 'Config' | 'Save' | 'Load' | 'Backlog'

export const GUIGameRootState = useSignal<GUIGameRootPages>('Game')

// 剧情结束时回到标题页
StarNight.GameEvents.end.subscribe(() => GUIRootState('Home'))

// 自动存档
StarNight.ActEvents.start.subscribe(async ({ state, current }) => {
    if (!state.isInitializing() && !state.isFast()) {
        const store = await onStoreReady
        store.local[0](current())
    }
})

export const useGame = async (local: GameConstructorParams['local']) => {
    starnight()?.stop()
    starnight(await instance(local))
    GUIRootState('Game')
    GUIGameRootState('Game')
    starnight().start()
}

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
                            starnight().ClickEvents.fast.publish()
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
            <Content ref={suppress('contextmenu')} onContextMenu={() => GUIGameRootState('Game')}>
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
