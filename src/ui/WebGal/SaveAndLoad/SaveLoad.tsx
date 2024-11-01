import type { Component } from 'solid-js'
import dayjs from 'dayjs'
import { Show } from 'solid-js'
import { useStore } from '@/store/context'
import { translation } from '@/store/effect/translations'
import { Button, Clone } from '@/ui/Elements'
import { useSignal } from '@/utils/Reactive'
import styles from './SaveAndLoad.module.scss'

const SaveLoad: Component<{ mode: 'Save' | 'Load' }> = ({ mode }) => {
    const currentPage = useSignal(0)
    const t = translation.menu

    const save = useStore().save.local
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
                                classList={{
                                    [styles.Save_Load_top_button]: true,
                                    [styles.Save_Load_top_button_on]: currentPage() === i,
                                    [styles.Load_top_button]: mode === 'Load',
                                    [styles.Load_top_button_on]: mode === 'Load' && currentPage() === i
                                }}>
                                <div class={styles.Save_Load_top_button_text}>{i + 1}</div>
                            </Button>
                        )}
                    </Clone>
                </div>
            </div>
            <div class={styles.Save_Load_content}>
                <Clone count={10}>
                    {(i) => (
                        <Button
                            class={styles.Save_Load_content_element}
                            style={{ 'animation-delay': `${(i + 1) * 30}ms` }}>
                            <Show when={save()[i]} fallback={<div />}>
                                <div class={styles.Save_Load_content_element_top}>
                                    <div
                                        classList={{
                                            [styles.Save_Load_content_element_top_index]: true,
                                            [styles.Load_content_element_top_index]: mode === 'Load'
                                        }}>
                                        {i + 1 + currentPage() * 10}
                                    </div>
                                    <div
                                        classList={{
                                            [styles.Save_Load_content_element_top_date]: true,
                                            [styles.Load_content_element_top_date]: mode === 'Load'
                                        }}>
                                        {dayjs().format('MM-DD HH:mm:ss')}
                                    </div>
                                </div>
                                <div class={styles.Save_Load_content_miniRen}>
                                    <img class={styles.Save_Load_content_miniRen_bg} alt="Save_img_preview" src={''} />
                                </div>
                                <div class={styles.Save_Load_content_text}>
                                    <div
                                        classList={{
                                            [styles.Save_Load_content_speaker]: true,
                                            [styles.Load_content_speaker]: mode === 'Load'
                                        }}>
                                        {'咸鱼'}
                                    </div>
                                    <div class={styles.Save_Load_content_text_padding}>{'摸鱼'}</div>
                                </div>
                            </Show>
                        </Button>
                    )}
                </Clone>
            </div>
        </div>
    )
}

export default SaveLoad
