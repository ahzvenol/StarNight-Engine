import type { Component } from 'solid-js'
import { throttle } from 'es-toolkit'
import { useSignal } from 'micro-reactive-solid'
import { Show } from 'solid-js'
import { Content } from '@/core/ui/Elements'
import { starnight, ui } from '@/store/starnight'
import { GUIGameRootState } from '@/ui/GameRoot'
import { log } from '@/utils/Logger'
import { useKeyPress } from '@/utils/solid/useKeyPress'
import { Choice } from './Choice'
import { ControlPanel } from './ControlPanel'
import styles from './Game.module.scss'
import { Stage } from './Stage'
import { TextBox } from './TextBox'
import { Video } from './Video'

export const showBox = useSignal(true)

const Game: Component = () => {
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
    return (
        <Content>
            <Stage />
            <Show when={showBox() && ui().textboxstate() && !ui().choicesstate() && GUIGameRootState() !== 'Backlog'}>
                <TextBox />
            </Show>
            <div class={styles.Game_mask} onClick={() => click()} onContextMenu={() => showBox(false)} />
            <Show when={!showBox()}>
                <div class={styles.Game_mask} onClick={() => showBox(true)} onContextMenu={() => showBox(true)} />
            </Show>
            <Show when={showBox() && ui().textboxstate() && GUIGameRootState() !== 'Backlog'}>
                <ControlPanel />
            </Show>
            <Show when={ui().check()}>
                <div class={styles.Game_mask} onClick={() => ui().check()} />
            </Show>
            <Show when={ui().choicesstate()}>
                <Choice />
            </Show>
            <Show when={ui().video()}>
                <Video />
            </Show>
            <Show when={ui().clickstate()}>
                <Content
                    ref={() => {
                        useKeyPress('Space', click)
                        useKeyPress('Enter', click)
                    }}
                />
            </Show>
            <Show when={!ui().clickstate()}>
                <div class={styles.Game_mask} />
            </Show>
        </Content>
    )
}

export default Game
