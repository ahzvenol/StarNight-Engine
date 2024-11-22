import type { Component } from 'solid-js'
import { useSignal } from '@/utils/Reactive'
import styles from './LandingPage.module.scss'

const enter = useSignal(false)

export const isEnter = () => enter()

const LandingPage: Component = () => {
    const opacity = useSignal(1)

    const onClick = () => {
        opacity(0)
        setTimeout(() => {
            enter(true)
        }, 1000)
    }

    return (
        <div class={'Page' + ' ' + styles.LandingPage_container} style={{ opacity: opacity() }} onClick={onClick}>
            <link rel="preload" href="/static/Texture2D/title_bg.png" as="image" />
            <link rel="preload" href="/static/AudioClip/bgm01.wav" as="audio" />
            <div class={styles.LandingPage_tip}>PRESS THE SCREEN TO START</div>
        </div>
    )
}
export default LandingPage