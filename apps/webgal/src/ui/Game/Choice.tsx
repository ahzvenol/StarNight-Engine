import type { Component } from 'solid-js'
import { For } from 'solid-js'
import { useSoundEffect } from '../useSoundEffect'
import styles from './Choice.module.scss'
import { ui } from '@/store/starnight'
import { stopPropagation } from '@/utils/solid/stopPropagation'

export const Choice: Component = () => {
    return (
        <div ref={stopPropagation('click')} class={styles.Game_Choice_container}>
            <For each={ui().choices()}>
                {(choice) => (
                    <div
                        ref={useSoundEffect('Click', 'Enter')}
                        class={choice.disable ? styles.Game_Choice_item_disabled : styles.Game_Choice_item}
                        onClick={choice.choose}
                    >
                        {choice.text}
                    </div>
                )}
            </For>
        </div>
    )
}
