import type { Component } from 'solid-js'
import { Show } from 'solid-js'
import { videoView } from '@/core/commands/script/video'
import styles from './Video.module.scss'

export const Video: Component = () => {
    return (
        <div class={styles.Video_container} style={{ display: 'contents' }}>
            <Show when={videoView()}>{videoView()}</Show>/
        </div>
    )
}
