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

export const showBox = useSignal(true)

export const Game: Component = () => {
    log.info('GameUI组件函数被调用')

    showBox(true)

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
        if (ui().state.click()) {
            useKeyPress('Space', click)
            useKeyPress('Enter', click)
        }
    })
    return (
        <Content>
            <Stage />
            <Show when={showBox() && ui().state.box() && !ui().input.choices() && GUIGameRootState() !== 'Backlog'}>
                <TextBox />
            </Show>
            <div class={styles.Game_mask} onClick={() => click()} onContextMenu={() => showBox(false)} />
            <Show when={!showBox()}>
                <div class={styles.Game_mask} onClick={() => showBox(true)} onContextMenu={() => showBox(true)} />
            </Show>
            <Show when={showBox() && ui().state.box() && GUIGameRootState() !== 'Backlog'}>
                <ControlPanel />
            </Show>
            <Show when={ui().input.click()}>
                <div class={styles.Game_mask} onClick={() => ui().input.click()} />
            </Show>
            <Show when={ui().input.text()}>
                <TextInput />
            </Show>
            <Show when={ui().input.choices()}>
                <Choice />
            </Show>
            <Show when={ui().video()}>
                <Video />
            </Show>
            <Show when={!ui().state.click()}>
                <div class={styles.Game_mask} />
            </Show>
            <Show when={ui().input.iframe()}>
                <Iframe />
            </Show>
        </Content>
    )
}
