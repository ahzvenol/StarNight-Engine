import type { Component } from 'solid-js'
import { Show } from 'solid-js'
import { ui } from '@/store/starnight'
import { Clone, Content } from '@/utils/ui/Elements'
import styles from './Blind.module.scss'

export const Blind: Component = () => {
    return (
        <Show when={ui().blindstate()}>
            <Content style={{ 'pointer-events': 'none' }}>
                <div class={styles.Game_Blind_container}>
                    <Clone count={8}>{() => <div class={styles.Game_Blind} />}</Clone>
                </div>
                <div class={styles.Game_Blind_screen_overlay} />
            </Content>
        </Show>
    )
}
