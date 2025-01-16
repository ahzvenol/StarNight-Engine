import type { Component } from 'solid-js'
import clsx from 'clsx'
import { useStore } from '@/store/context'
import { Clone, Variable } from '@/ui/Elements'
import { log } from '@/utils/logger'
import { useSignal } from '@/utils/Reactive'
import { ReRender } from '@/utils/solid/ReRender'
import styles from './SaveAndLoad.module.scss'
import { SaveLoadElement } from './SaveLoadElement'

export type SaveLoadMode = 'Save' | 'Load'

// 退出存档页面再进入不会重置到第一页
const currentPage = useSignal(0)

const SaveLoad: Component<{ mode: SaveLoadMode }> = ({ mode }) => {
    log.info('SaveLoad组件函数被调用.')
    const saves = useStore().save.local
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
                                    <SaveLoadElement save={saves[index()]} mode={mode} index={index()} />
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
