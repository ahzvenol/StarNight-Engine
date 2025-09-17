import type { Component } from 'solid-js'
import { Show } from 'solid-js'
import { Content, Clone } from '@/utils/ui/Elements'
import { ui } from '@/store/starnight'
import styles from './Transition.module.scss'

export const Transition: Component = () => {
    return (
        <Show when={ui().transition()!.type === 'BlindH8'}>
            <Content style={{ 'pointer-events': 'none' }}>
                <div class={styles.Game_Blind_container}>
                    <Clone count={8}>{() => <div class={styles.Game_Blind} />}</Clone>
                </div>
                <div class={styles.Game_Blind_screen_overlay} />
            </Content>
        </Show>
    )
}
