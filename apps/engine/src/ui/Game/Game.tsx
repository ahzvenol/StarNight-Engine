import type { Component } from 'solid-js'
import { throttle } from 'es-toolkit'
import { useSignal } from 'micro-reactive-solid'
import { createEffect, Show } from 'solid-js'
import { Content } from '@/utils/ui/Elements'
import { starnight, ui } from '@/store/starnight'
import { GUIGameRootState } from '@/ui/GameRoot'
import { log } from '@/utils/Logger'
import { useKeyPress } from '@/utils/solid/useKeyPress'
import { Choice } from './Choice'
import { ControlPanel } from './ControlPanel'
import styles from './Game.module.scss'
import { Stage } from './Stage'
import { TextBox } from './TextBox'
import { TextInput } from './TextInput'
import { Video } from './Video'
import { Iframe } from './Iframe'
import { Transition } from './Transition'

export const showUI = useSignal(true)

export const Game: Component = () => {
    log.info('GameUI组件函数被调用')

    showUI(true)

    // 为点击设置0.1秒节流
    const click = throttle(
        () => {
            if (starnight().state.isFast()) {
                starnight().ClickEvents.fast.publish()
            } else {
                starnight().ClickEvents.step.publish()
            }
        },
        100,
        { edges: ['leading'] }
    )

    createEffect(() => {
        if (ui().state.click() === 0) {
            useKeyPress('Space', click)
            useKeyPress('Enter', click)
        }
    })

    return (
        <Content>
            <Stage />
            <Show when={showUI() && ui().state.ui() === 0 && GUIGameRootState() !== 'Backlog'}>
                <div style={{ display: (ui().text() !== null && ui().input.choices() === null) ? 'contents' : 'none' }}>
                    <TextBox text={ui().text()} name={ui().name} />
                </div>
            </Show>
            <div class={styles.Game_mask} onClick={() => click()} onContextMenu={() => showUI(false)} />
            <Show when={!showUI()}>
                <div class={styles.Game_mask} onClick={() => showUI(true)} onContextMenu={() => showUI(true)} />
            </Show>
            <Show when={showUI() && ui().state.ui() === 0 && GUIGameRootState() !== 'Backlog'}>
                <div style={{ display: (ui().text() !== null || ui().input.choices() !== null) ? 'contents' : 'none' }}>
                    <ControlPanel />
                </div>
            </Show>
            <Show when={ui().input.click() !== null}>
                <div class={styles.Game_mask} onClick={ui().input.click()!} />
            </Show>
            <Show when={ui().transition() !== null}>
                <Transition />
            </Show>
            <Show when={ui().input.text() !== null}>
                <TextInput />
            </Show>
            <Show when={ui().input.choices() !== null}>
                <Choice />
            </Show>
            <Show when={ui().video() !== null}>
                <Video />
            </Show>
            <Show when={ui().state.click() !== 0}>
                <div class={styles.Game_mask} />
            </Show>
            <Show when={ui().input.iframe() !== null}>
                <Iframe />
            </Show>
        </Content>
    )
}
