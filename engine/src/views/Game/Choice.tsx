import type { Component } from 'solid-js'
import { For } from 'solid-js'
import { ui } from '@/store/starnight'
import { suppress } from '@/utils/solid/suppress'
import { useSoundEffect } from '../useSoundEffect'
import styles from './Choice.module.scss'

export const Choice: Component = () => {
    return (
        <div ref={suppress('click')} class={styles.Game_Choice_container}>
            <For each={ui().input.choices()}>
                {(choice) => (
                    <div
                        ref={useSoundEffect('Click', 'Enter')}
                        class={choice.disable ? styles.Game_Choice_item_disabled : styles.Game_Choice_item}
                        onClick={() => choice.resolve()}
                    >
                        {choice.text}
                    </div>
                )}
            </For>
        </div>
    )
}
