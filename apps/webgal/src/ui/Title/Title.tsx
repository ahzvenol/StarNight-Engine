import type { Component } from 'solid-js'
import { Clone } from '@/core/ui/Elements'
import { store } from '@/store'
import { useGame } from '../GameRoot'
import { GUIHomeRootState } from '../HomeRoot'
import { translation } from '../translations'
import { useSoundEffect } from '../useSoundEffect'
import styles from './Title.module.scss'

const Title: Component = () => {
    const t = translation.title

    const slot = store.local[0]
    return (
        <>
            <div class={styles.Title_backup_background} />
            <div
                class={styles.Title_main}
                style={{
                    'background-size': 'cover',
                    'background-image': 'url(./static/Texture2D/title_bg.webp)'
                }}>
                <div class={styles.Title_button_list}>
                    <Clone count={5}>
                        {(i) => (
                            <div
                                ref={useSoundEffect('Click', 'Enter')}
                                class={styles.Title_button}
                                onClick={
                                    [
                                        () => useGame({ index: 1 }),
                                        () => (slot() ? useGame(slot()!) : useGame({ index: 1 })),
                                        () => GUIHomeRootState('Config'),
                                        () => GUIHomeRootState('Load'),
                                        () => GUIHomeRootState('Gallery')
                                    ][i]
                                }>
                                <div class={styles.Title_button_text}>
                                    {t[(['start', 'continue', 'options', 'load', 'extra'] as const)[i]].title()}
                                </div>
                            </div>
                        )}
                    </Clone>
                </div>
            </div>
        </>
    )
}

export default Title
