import { useStore } from '@/store/context'
import { useSignal } from '@/utils/Reactive'
import { Component, Show } from 'solid-js'
import { Button, Clone } from '../../Elements'
import styles from './SaveAndLoad.module.scss'
import { Variable } from '@/ui/Elements'

const SaveLoad: Component<{ mode: 'Save' | 'Load' }> = ({ mode }) => {
    const currentPage = useSignal(0)

    const save = useStore().save.individual
    return (
        <div class={styles.Save_Load_container}>
            <div
                class={styles.Save_Load_title}
                style={{
                    'background-image':
                        mode === 'Save'
                            ? 'url(./static/Texture2D/SaveButton.png)'
                            : 'url(./static/Texture2D/LoadButton.png)'
                }}
            />
            <p
                class={styles.Save_Load_top_arrow + ' ' + styles.Save_Load_top_arrow_left}
                onClick={() => (currentPage() > 0 ? currentPage((i) => i - 1) : currentPage(9))}
            />
            <p class={styles.Save_Load_top_arrow_mask + ' ' + styles.Save_Load_top_arrow_mask_left} />
            <p
                class={styles.Save_Load_top_arrow + ' ' + styles.Save_Load_top_arrow_right}
                onClick={() => (currentPage() < 9 ? currentPage((i) => i + 1) : currentPage(0))}
            />
            <p class={styles.Save_Load_top_arrow_mask + ' ' + styles.Save_Load_top_arrow_mask_right} />
            <div class={styles.Save_Load_top_buttonList}>
                <Clone count={10}>
                    {(i) => (
                        <Button
                            class={styles.Save_Load_top_button}
                            onClick={() => currentPage(i)}
                            style={{ 'background-color': currentPage() === i ? 'white' : '#909090' }}
                        />
                    )}
                </Clone>
            </div>
            {/* <div class={styles.Save_Load_content}>
                <Variable value={9}>
                    {(count) => (
                        <Clone count={count}>
                            {(i) => (
                                <div class={styles.Save_Load_content_element}>
                                    <Show when={save()[i] === undefined} fallback={<div />}>
                                        <div class={styles.Save_Load_content_element_top}>
                                            <div
                                                classList={{
                                                    [styles.Save_Load_content_element_top_index]: true,
                                                    [styles.Load_content_element_top_index]: mode === 'Load'
                                                }}>
                                                No.&nbsp;&nbsp;&nbsp;{i + 1 + currentPage() * count}
                                            </div>
                                            <div
                                                classList={{
                                                    [styles.Save_Load_content_element_top_date]: true,
                                                    [styles.Load_content_element_top_date]: mode === 'Load'
                                                }}>
                                                {new Date().format('MM-dd hh:mm:ss')}
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
                                                classList={{
                                                    [styles.Save_Load_content_speaker]: true,
                                                    [styles.Load_content_speaker]: mode === 'Load'
                                                }}>
                                                {'咸鱼'}
                                            </div>
                                            <div class={styles.Save_Load_content_text_padding}>{'摸鱼'}</div>
                                        </div>
                                    </Show>
                                </div>
                            )}
                        </Clone>
                    )}
                </Variable>
            </div> */}
        </div>
    )
}

export default SaveLoad
