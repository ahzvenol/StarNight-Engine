import type { Component } from 'solid-js'
import { throttle } from 'es-toolkit'
import { useSignal } from 'micro-reactive-solid'
import { createEffect, Show } from 'solid-js'
import { Content } from '@/utils/ui/Elements'
import { starnight, ui } from '@/store/starnight'
import { GUIGameRootState } from '@/views/GameRoot'
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

export const Game: Component = () => {
    log.info('GameUI组件函数被调用')

    const isUIVisible = useSignal(true)

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
            <Stage view={ui().view} />
            <Show when={isUIVisible() && ui().state.ui() === 0 && GUIGameRootState() !== 'Backlog'}>
                <div style={{ display: (ui().text() !== null && ui().input.choices() === null) ? 'contents' : 'none' }}>
                    <TextBox text={ui().text()!} name={ui().name()} />
                </div>
            </Show>
            <div class={styles.Game_mask} onClick={() => click()} onContextMenu={() => isUIVisible(false)} />
            <Show when={!isUIVisible()}>
                <div class={styles.Game_mask} onClick={() => isUIVisible(true)} onContextMenu={() => isUIVisible(true)} />
            </Show>
            <Show when={isUIVisible() && ui().state.ui() === 0 && GUIGameRootState() !== 'Backlog'}>
                <div style={{ display: (ui().text() !== null || ui().input.choices() !== null) ? 'contents' : 'none' }}>
                    <ControlPanel setUIHidden={() => isUIVisible(false)} />
                </div>
            </Show>
            <Show when={ui().input.text() !== null}>
                <TextInput input={ui().input.text()!} />
            </Show>
            <Show when={ui().input.choices() !== null}>
                <Choice choices={ui().input.choices()!} />
            </Show>
            <Show when={ui().video() !== null}>
                <Video item={ui().video()!} />
            </Show>
            <Show when={ui().state.click() !== 0}>
                <div class={styles.Game_mask} />
            </Show>
            <Show when={ui().input.iframe() !== null}>
                <Iframe iframe={ui().input.iframe()!} />
            </Show>
        </Content>
    )
}
