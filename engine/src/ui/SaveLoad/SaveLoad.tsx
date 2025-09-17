import type { Component } from 'solid-js'
import clsx from 'clsx'
import { useSignal } from 'micro-reactive-solid'
import { Show } from 'solid-js'
import { Clone, Variable } from '@/utils/ui/Elements'
import { store } from '@/store'
import { translation } from '../translations'
import { useSoundEffect } from '../useSoundEffect'
import styles from './SaveLoad.module.scss'
import { SaveLoadElement } from './SaveLoadElement'

export type SaveLoadMode = 'Save' | 'Load'

const currentPage = useSignal(0)
export const SaveLoad: Component<{ mode: SaveLoadMode }> = ({ mode }) => {
    const t = translation.menu

    const local = store.local
    const pageElementCount = 10
    return (
        <>
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
                                <div
                                    ref={useSoundEffect('PageChange', 'Enter')}
                                    onClick={() => currentPage(i)}
                                    class={clsx(styles.Save_Load_top_button, {
                                        [styles.Save_Load_top_button_active]: currentPage() === i,
                                        [styles.Load_top_button]: mode === 'Load',
                                        [styles.Load_top_button_active]: mode === 'Load' && currentPage() === i
                                    })}
                                >
                                    <div class={styles.Save_Load_top_button_text}>{i + 1}</div>
                                </div>
                            )}
                        </Clone>
                    </div>
                </div>
                <div class={styles.Save_Load_content}>
                    <Clone count={pageElementCount}>
                        {(i) => (
                            <Variable value={() => i + 1 + currentPage() * pageElementCount}>
                                {(index) => (
                                    <Show keyed when={local[index()]}>
                                        <SaveLoadElement i={i} mode={mode} index={index()} slot={local[index()]} />
                                    </Show>
                                )}
                            </Variable>
                        )}
                    </Clone>
                </div>
            </div>
        </>
    )
}
