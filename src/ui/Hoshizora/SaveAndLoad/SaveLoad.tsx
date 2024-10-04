import { useStore } from '@/store/context'
import { Button, Clone, Variable } from '@/ui/Elements'
import { useSignal } from '@/utils/Reactive'
import { format } from 'date-fns'
import { Component } from 'solid-js'
import styles from './SaveAndLoad.module.scss'

const SaveLoad: Component<{ mode: 'Save' | 'Load' }> = ({ mode }) => {
    const currentPage = useSignal(0)

    const save = useStore().save.individual
    return (
        <div class={'Page' + ' ' + styles.Save_Load_container}>
            <div
                class={styles.Save_Load_title}
                style={{
                    'background-image':
                        mode === 'Save'
                            ? 'url(./static/Texture2D/SaveButton.png)'
                            : 'url(./static/Texture2D/LoadButton.png)'
                }}
            />
            {/* tag:魔法方案的闪烁问题非常严重并且影响操作,暂时放弃对transition: 0.15s的支持 */}
            <p
                class={styles.Save_Load_top_arrow + ' ' + styles.Save_Load_top_arrow_left}
                onClick={() => (currentPage() > 0 ? currentPage((i) => i - 1) : currentPage(9))}
            />
            <p
                class={styles.Save_Load_top_arrow + ' ' + styles.Save_Load_top_arrow_right}
                onClick={() => (currentPage() < 9 ? currentPage((i) => i + 1) : currentPage(0))}
            />
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
            <div class={styles.Save_Load_content}>
                <Variable value={9}>
                    {(count) => (
                        <Clone count={count}>
                            {(i) => (
                                // todo:!empty时才有:hover和Button行为
                                <div class={styles.Save_Load_content_element}>
                                    <div class={styles.Save_Load_content_element_empty_image} />
                                    <div class={styles.Save_Load_content_element_index}>
                                        {/* 原作从0开始 */}
                                        No.&nbsp;&nbsp;&nbsp;{i + 1 + currentPage() * count}
                                    </div>
                                    <div class={styles.Save_Load_content_element_date}>
                                        {format(new Date(), 'yyyy/MM/dd hh:mm:ss')}
                                    </div>
                                    <Variable value={save()[i + 1 + currentPage() * count]}>
                                        {(save) => (
                                            <div class={styles.Save_Load_content_text}>{save?.text || 'Empty'}</div>
                                        )}
                                    </Variable>
                                </div>
                            )}
                        </Clone>
                    )}
                </Variable>
            </div>
        </div>
    )
}

export default SaveLoad