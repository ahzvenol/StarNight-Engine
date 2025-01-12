import type { Component } from 'solid-js'
import { For, Show } from 'solid-js'
import { displaySelectionView, selections } from '@/core/commands/script/hoshizora/selection'
import { stopPropagation } from '@/utils/solid/stopPropagation'
import styles from './Selection.module.scss'

export const Selection: Component = () => {
    return (
        <Show when={displaySelectionView()}>
            <div class={styles.Game_Selection_container} onClick={stopPropagation}>
                <For each={selections}>
                    {(sel) => (
                        <div class={styles.Game_Selection_item} onClick={sel.select}>
                            <div class={styles.Game_Selection_item_background} />
                            <div class={styles.Game_Selection_item_text}>{sel.label}</div>
                        </div>
                    )}
                </For>
            </div>
        </Show>
    )
}
