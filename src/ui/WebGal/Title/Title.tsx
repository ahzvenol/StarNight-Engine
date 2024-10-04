import { Component } from 'solid-js'
import { router } from '../../../router'
import { translation } from '@/store/effect/translations'
import { Button, Clone } from '@/ui/Elements'
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
                    'background-image': 'url(./Texture2D/title_bg.png)',
                    'background-size': 'cover'
                }}>
                <div class={styles.Title_buttonList}>
                    <Clone count={5}>
                        {(i) => (
                            <Button
                                class={styles.Title_button}
                                onClick={
                                    [
                                        () => {},
                                        () => {},
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
