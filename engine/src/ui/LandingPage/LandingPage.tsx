import type { Component } from 'solid-js'
import { useSignal } from 'micro-reactive-solid'
import { GUIRootState } from '../GUIRoot'
import styles from './LandingPage.module.scss'

export const LandingPage: Component = () => {
    const opacity = useSignal(1)

    const onClick = () => {
        opacity(0)
        setTimeout(() => {
            GUIRootState('Home')
        }, 1000)
    }
    return (
        <div class={styles.LandingPage_container} style={{ opacity: opacity() }} onClick={onClick}>
            <link rel="preload" href="/Texture2D/title_bg.webp" as="image" />
            <link rel="preload" href="/AudioClip/bgm01.flac" as="audio" />
            <div class={styles.LandingPage_tip}>PRESS THE SCREEN TO START</div>
        </div>
    )
}
