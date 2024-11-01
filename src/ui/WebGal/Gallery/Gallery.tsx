import type { Component } from 'solid-js'
import { router } from '@/router'
import { translation } from '@/store/effect/translations'
import { Button } from '@/ui/Elements'
import styles from './Gallery.module.scss'

const CloseSmall: Component = () => (
    <svg width="4em" height="4em" viewBox="0 0 48 48" fill="none">
        <path d="M14 14L34 34" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M14 34L34 14" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
)

const Gallery: Component = () => {
    const t = translation.extra

    return (
        <div class={styles.extra}>
            <div class={styles.extra_top}>
                <Button class={styles.extra_top_icon} onClick={router.back}>
                    <CloseSmall />
                </Button>
                <div class={styles.extra_title}>{t.title()}</div>
            </div>
            <div class={styles.mainContainer}>
                {/* <ExtraCg />
        <ExtraBgm /> */}
            </div>
        </div>
    )
}

export default Gallery
