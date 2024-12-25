import type { Component } from 'solid-js'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Show } from 'solid-js'
import { useStore } from '@/store/context'
import { translation } from '@/store/effects/translations'
import { Button, Clone, Variable } from '@/ui/Elements'
import { useSignal } from '@/utils/Reactive'
import { ReRender } from '@/utils/ReRender'
import styles from './SaveAndLoad.module.scss'

const SaveLoad: Component<{ mode: 'Save' | 'Load' }> = ({ mode }) => {
    const t = translation.menu
    const currentPage = useSignal(0)
    const saves = useStore().save.local
    const pageElementCount = 10
    return (
        <div class={styles.Save_Load_main}>
            <div class={styles.Save_Load_top}>
                <div class={styles.Save_Load_title}>
                    <div class={mode === 'Save' ? styles.Save_title_text : styles.Load_title_text}>
                        {mode === 'Save' ? t.saving.title() : t.loadSaving.title()}
                    </div>
                </div>
                <div class={styles.Save_Load_top_buttonList}>
                    <Clone count={20}>
                        {(i) => (
                            <Button
                                onClick={() => currentPage(i)}
                                class={clsx(styles.Save_Load_top_button, {
                                    [styles.Save_Load_top_button_on]: currentPage() === i,
                                    [styles.Load_top_button]: mode === 'Load',
                                    [styles.Load_top_button_on]: mode === 'Load' && currentPage() === i
                                })}>
                                <div class={styles.Save_Load_top_button_text}>{i + 1}</div>
                            </Button>
                        )}
                    </Clone>
                </div>
            </div>
            <div class={styles.Save_Load_content}>
                <Clone count={pageElementCount}>
                    {(i) => (
                        <Variable value={() => i + 1 + currentPage() * pageElementCount}>
                            {(index) => (
                                <ReRender key={index}>
                                    <Variable value={saves[index()]}>
                                        {(save) => (
                                            <Button
                                                class={styles.Save_Load_content_element}
                                                style={{ 'animation-delay': `${(i + 1) * 30}ms` }}>
                                                <Show when={save()}>
                                                    <div class={styles.Save_Load_content_element_top}>
                                                        <div
                                                            class={clsx(styles.Save_Load_content_element_top_index, {
                                                                [styles.Load_content_element_top_index]: mode === 'Load'
                                                            })}>
                                                            {index()}
                                                        </div>
                                                        <div
                                                            class={clsx(styles.Save_Load_content_element_top_date, {
                                                                [styles.Load_content_element_top_date]: mode === 'Load'
                                                            })}>
                                                            {dayjs().format('MM-DD HH:mm:ss')}
                                                        </div>
                                                    </div>
                                                    <div class={styles.Save_Load_content_miniRen}>
                                                        <img
                                                            class={styles.Save_Load_content_miniRen_bg}
                                                            alt="Save_img_preview"
                                                            src={''}
                                                        />
                                                    </div>
                                                    <div class={styles.Save_Load_content_text}>
                                                        <div
                                                            class={clsx(styles.Save_Load_content_speaker, {
                                                                [styles.Load_content_speaker]: mode === 'Load'
                                                            })}>
                                                            {'咸鱼'}
                                                        </div>
                                                        <div class={styles.Save_Load_content_text_padding}>
                                                            {'摸鱼'}
                                                        </div>
                                                    </div>
                                                </Show>
                                            </Button>
                                        )}
                                    </Variable>
                                </ReRender>
                            )}
                        </Variable>
                    )}
                </Clone>
            </div>
        </div>
    )
}

export default SaveLoad
