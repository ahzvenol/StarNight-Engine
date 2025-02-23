import type { Component } from 'solid-js'
import { noop } from 'es-toolkit'
import { translation } from '@/store/effects/translations'
import { Button, Clone } from '@/ui/Elements'
import { router } from '../../../router'
import styles from './Title.module.scss'

/**
 * 标题页
 */
const Title: Component = () => {
    const t = translation.title
    return (
        <>
            <div class={styles.Title_backup_background} />
            <div
                class={styles.Title_main}
                style={{
                    'background-image': 'url(./static/Texture2D/title_bg.webp)',
                    'background-size': 'cover'
                }}>
                <div class={styles.Title_buttonList}>
                    <Clone count={5}>
                        {(i) => (
                            <Button
                                class={styles.Title_button}
                                onClick={
                                    [
                                        noop,
                                        noop,
                                        () => router.navigate('Config'),
                                        () => router.navigate('Load'),
                                        () => router.navigate('Gallery')
                                    ][i]
                                }>
                                <div class={styles.Title_button_text}>
                                    {t[(['start', 'continue', 'options', 'load', 'extra'] as const)[i]].title()}
                                </div>
                            </Button>
                        )}
                    </Clone>
                </div>
            </div>
        </>
    )
}

export default Title
