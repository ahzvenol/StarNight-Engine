import type { Component } from 'solid-js'
import { Show } from 'solid-js'
import clsx from 'clsx'
import { useSignal } from 'micro-reactive-solid'
import { Clone, Variable } from '@/utils/ui/Elements'
import { log } from '@/utils/Logger'
import { store } from '@/store'
import styles from './SaveLoad.module.scss'
import { SaveLoadElement } from './SaveLoadElement'

export type SaveLoadMode = 'Save' | 'Load'

// 退出存档页面再进入不会重置到第一页
const currentPage = useSignal(0)

export const SaveLoad: Component<{ mode: SaveLoadMode }> = ({ mode }) => {
    log.info('SaveLoad组件函数被调用')
    const local = store.local
    const pageElementCount = 9

    return (
        <div class={clsx('Page', styles.Save_Load_container)}>
            <div
                class={styles.Save_Load_title}
                style={{
                    'background-image':
                        mode === 'Save'
                            ? 'url(./static/Texture2D/SaveButton.webp)'
                            : 'url(./static/Texture2D/LoadButton.webp)'
                }}
            />
            {/* tag:魔法方案的闪烁问题非常严重并且影响操作,暂时放弃对transition: 0.15s的支持 */}
            <div class={styles.Save_Load_top_button_container}>
                <div
                    class={clsx(styles.Save_Load_top_arrow, styles.Save_Load_top_arrow_left)}
                    onClick={() => (currentPage() > 0 ? currentPage((i) => i - 1) : currentPage(9))}
                />
                <div
                    class={clsx(styles.Save_Load_top_arrow, styles.Save_Load_top_arrow_right)}
                    onClick={() => (currentPage() < 9 ? currentPage((i) => i + 1) : currentPage(0))}
                />
                <div class={styles.Save_Load_top_button_list}>
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
            </div>
            <div class={styles.Save_Load_content}>
                <Show keyed when={currentPage().toString()}>
                    <Clone count={pageElementCount}>
                        {(i) => (
                            <Variable value={() => i + currentPage() * pageElementCount}>
                                {(index) => (
                                    <SaveLoadElement slot={local[index()]} mode={mode} index={index()} />
                                )}
                            </Variable>
                        )}
                    </Clone>
                </Show>
            </div>
        </div>
    )
}
