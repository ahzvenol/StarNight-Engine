import type { Component } from 'solid-js'
import { Show } from 'solid-js'
import { videoView } from '@/core/commands/script/video'
import { Content } from '@/ui/Elements'
import styles from './Video.module.scss'

export const Video: Component = () => {
    return (
        <Content class={styles.Game_Video_container}>
            <Show when={videoView()}>{videoView()}</Show>
        </Content>
    )
}
