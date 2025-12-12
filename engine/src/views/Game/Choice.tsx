import type { Component } from 'solid-js'
import type { GameUIInputChoices } from '@/scripts/api/input'
import { For } from 'solid-js'
import { suppress } from '@/utils/solid/suppress'
import { useSoundEffect } from '../useSoundEffect'
import styles from './Choice.module.scss'

export const Choice: Component<{ choices: GameUIInputChoices }> = (props) => {
    return (
        <div ref={suppress('click')} class={styles.Game_Choice_container}>
            <For each={props.choices}>
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
