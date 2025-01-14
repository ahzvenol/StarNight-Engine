import type { Component } from 'solid-js'
import clsx from 'clsx'
import { useSignal } from '@/utils/Reactive'
import styles from './LandingPage.module.scss'

const enter = useSignal(false)

export const isEnter = () => enter()

const LandingPage: Component = () => {
    setTimeout(() => {
        enter(true)
    }, 3000)

    return (
        <div class={clsx('Page', styles.LandingPage_container)} onClick={() => enter(true)}>
            <link rel="preload" href="./static/Texture2D/title_bg.webp" as="image" />
            <link rel="preload" href="./static/AudioClip/bgm01.flac" as="audio" />
            <img class={styles.LandingPage_logo} src="./static/shiratamaco_logo.png" />
        </div>
    )
}
export default LandingPage
