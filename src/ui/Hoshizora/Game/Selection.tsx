import type { Component } from 'solid-js'
import { For, Show } from 'solid-js'
import { selectionView } from '@/core/commands/script/selection'
import { useSignal } from '@/utils/Reactive'
import styles from './Selection.module.scss'

export const displaySelection = useSignal(false)

export const Selection: Component = () => {
    return (
        <Show when={displaySelection()}>
            <div class={styles.Game_Selection_container} onClick={(event) => event.stopPropagation()}>
                <For each={selectionView}>
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
