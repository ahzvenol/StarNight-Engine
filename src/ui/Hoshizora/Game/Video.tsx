import { videoView } from '@/core/commands/script/video'
import { Component, Show } from 'solid-js'
import styles from './Video.module.scss'

export const Video: Component = () => {
    return (
        <div class={styles.Video_container} style={{ display: 'contents' }}>
            <Show when={videoView()}>{videoView()}</Show>/
        </div>
    )
}
