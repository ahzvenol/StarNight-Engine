import type { Component } from 'solid-js'
import type { Accessor } from 'micro-reactive-solid'
import { Show } from 'solid-js'
import { store } from '@/store'
import styles from './TextBox.module.scss'

export const TextBox: Component<{ text: HTMLElement, name: Accessor<string> }> = ({ text, name }) => {
    const config = store.config
    return (
        <div class={styles.Game_TextBox_container} style={{ 'font-family': config.textboxfont() }}>
            {/* 因为透明度继承,背景须作为单独元素 */}
            <div class={styles.Game_TextBox_text_background} style={{ opacity: config.textboxopacity() }} />
            <div class={styles.Game_TextBox_text} style={{ 'font-size': config.textboxfontsize() }}>
                {text}
            </div>
            <Show when={name() !== ''}>
                <div class={styles.Game_TextBox_name_container}>
                    <div class={styles.Game_TextBox_name_background} style={{ opacity: config.textboxopacity() }} />
                    <div class={styles.Game_TextBox_name}>{name()}</div>
                </div>
            </Show>
        </div>
    )
}
