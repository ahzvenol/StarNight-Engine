import type { Component } from 'solid-js'
import { CloseSmall } from 'icon-park-solid'
import { GUIHomeRootState } from '@/ui/HomeRoot'
import { translation } from '../translations'
import { useSoundEffect } from '../useSoundEffect'
import styles from './Gallery.module.scss'
import { GalleryCG } from './GalleryCG'

export const Gallery: Component = () => {
    const t = translation.extra
    return (
        <div class={styles.Gallery_container}>
            <div class={styles.Gallery_top}>
                <div
                    ref={useSoundEffect('Click', 'Enter')}
                    class={styles.Gallery_top_icon}
                    onClick={() => GUIHomeRootState('Title')}
                >
                    <CloseSmall theme="outline" size="4em" fill="#ffffff" strokeWidth={3} />
                </div>
                <div class={styles.Gallery_top_title}>{t.title()}</div>
            </div>
            <div class={styles.Gallery_content}>
                <GalleryCG />
            </div>
        </div>
    )
}
