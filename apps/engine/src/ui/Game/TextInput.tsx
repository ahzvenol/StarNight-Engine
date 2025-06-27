import type { Component } from 'solid-js'
import { useSignal } from 'micro-reactive-solid'
import { store } from '@/store'
import { ui } from '@/store/starnight'
import { useSoundEffect } from '../useSoundEffect'
import styles from './TextInput.module.scss'

export const TextInput: Component = () => {
    const config = store.config
    const input = useSignal('')
    return (
        <div class={styles.Game_TextInput_container_outer}>
            <div class={styles.Game_TextInput_container} style={{ 'font-family': config.textboxfont() }}>
                <div class={styles.Game_TextInput_container_inner}>
                    <div class={styles.Game_TextInput_title}>{ui().input.text()?.text || 'Please Input'}</div>
                    <input
                        class={styles.Game_TextInput_input}
                        onMouseDown={(e) => (e.target as HTMLInputElement).focus()}
                        onInput={(e) => input(e.target.value)}
                        value={input()}
                    />
                    <div
                        ref={useSoundEffect('Click', 'Enter')}
                        onClick={() => ui().input.text()!.resolve(input())}
                        class={styles.Game_TextInput_button}
                    >
                        OK
                    </div>
                </div>
            </div>
        </div>
    )
}
