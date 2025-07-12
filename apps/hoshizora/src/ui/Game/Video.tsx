import type { Component } from 'solid-js'
import { Show } from 'solid-js'
import { ui } from '@/store/starnight'
import { Content } from '@/utils/ui/Elements'
import styles from './Video.module.scss'

export const Video: Component = () => {
    return (
        <Content class={styles.Game_Video_container}>
            <Show when={ui().video()}>{ui().video()}</Show>
        </Content>
    )
}
