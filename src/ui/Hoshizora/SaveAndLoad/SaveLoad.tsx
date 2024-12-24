import type { Component } from 'solid-js'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Show } from 'solid-js'
import { getSave } from '@/core/save'
import { router } from '@/router'
import { useStore } from '@/store/context'
import { Clone, Variable } from '@/ui/Elements'
import { Pages, restartGame } from '@/ui/Pages'
import { log } from '@/utils/Logger'
import { useSignal } from '@/utils/Reactive'
import { ReRender } from '@/utils/ReRender'
import styles from './SaveAndLoad.module.scss'

const SaveLoad: Component<{ mode: 'Save' | 'Load' }> = ({ mode }) => {
    log.info('SaveLoad组件函数被调用.')
    const currentPage = useSignal(0)
    const saves = useStore().save.local
    const pageElementCount = 9

    return (
        <div class={clsx('Page', styles.Save_Load_container)}>
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
            <div
                class={clsx(styles.Save_Load_top_arrow, styles.Save_Load_top_arrow_left)}
                onClick={() => (currentPage() > 0 ? currentPage((i) => i - 1) : currentPage(9))}
            />
            <div
                class={clsx(styles.Save_Load_top_arrow, styles.Save_Load_top_arrow_right)}
                onClick={() => (currentPage() < 9 ? currentPage((i) => i + 1) : currentPage(0))}
            />
            <div class={styles.Save_Load_top_buttonList}>
                <Clone count={10}>
                    {(i) => (
                        <div
                            class={styles.Save_Load_top_button}
                            onClick={() => currentPage(i)}
                            style={{ 'background-color': currentPage() === i ? 'white' : '#909090' }}
                        />
                    )}
                </Clone>
            </div>
            <div class={styles.Save_Load_content}>
                <Clone count={pageElementCount}>
                    {(i) => (
                        <Variable value={() => i + 1 + currentPage() * pageElementCount}>
                            {(index) => (
                                <ReRender key={index}>
                                    <Variable value={saves[index()]}>
                                        {(save) => (
                                            <div
                                                class={clsx(styles.Save_Load_content_element, {
                                                    [styles.Save_Load_content_element_hover]:
                                                        mode === 'Save' || save() !== undefined
                                                })}
                                                onClick={() => {
                                                    if (mode === 'Save') {
                                                        save(getSave())
                                                    } else if (save() !== undefined) {
                                                        restartGame(save()!)
                                                        router.navigate(Pages.Game)
                                                    }
                                                }}>
                                                <div class={styles.Save_Load_content_element_index}>
                                                    {/* 原作从0开始 */}
                                                    No.&nbsp;&nbsp;&nbsp;{index()}
                                                </div>
                                                <Show
                                                    when={save() !== undefined}
                                                    fallback={
                                                        <>
                                                            <div class={styles.Save_Load_content_element_empty_image} />
                                                            <div class={styles.Save_Load_content_text}>Empty</div>
                                                        </>
                                                    }>
                                                    <div
                                                        class={styles.Save_Load_content_element_image}
                                                        style={{ 'background-image': `url(${save().image})` }}
                                                    />
                                                    <div class={styles.Save_Load_content_element_date}>
                                                        {dayjs(save().date).format('YYYY/MM/DD HH:mm:ss')}
                                                    </div>
                                                    <div class={styles.Save_Load_content_text}>{save().text}</div>
                                                </Show>
                                            </div>
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
