import type { Component } from 'solid-js'
import { For, Show } from 'solid-js'
import { fullTextView, nameView, textView, textWasReadView } from '@/core/commands/script/textbox'
import { useStore } from '@/store/context'
import styles from './TextBox.module.scss'

export const TextBox: Component = () => {
    const config = useStore().config

    const lines = () =>
        textView()
            .split('\n')
            .filter((line) => line !== '')

    return (
        <>
            <div class={styles.Game_TextBox_text_container}>
                {/* 因为透明度继承问题,对背景图片进行分离 */}
                <div class={styles.Game_TextBox_text_background} style={{ opacity: 1 - config.TextBoxOpacity() }} />
                <div class={styles.Game_TextBox_text} style={{ color: textWasReadView() ? '#96c7ec' : '#ffffff' }}>
                    <For each={lines()}>
                        {(line, index) => (
                            <>
                                <div>
                                    {line}
                                    <Show when={index() === lines().length - 1 && textView() === fullTextView()}>
                                        <span class={styles.Game_TextBox_star} />
                                    </Show>
                                </div>
                                <Show when={index() !== lines().length - 1}>
                                    <br />
                                </Show>
                            </>
                        )}
                    </For>
                </div>
            </div>
            <Show when={nameView() !== ''}>
                <div class={styles.Game_TextBox_name_container}>
                    <div class={styles.Game_TextBox_name_background} style={{ opacity: 1 - config.TextBoxOpacity() }} />
                    <div class={styles.Game_TextBox_name}>{nameView()}</div>
                </div>
            </Show>
        </>
    )
}
