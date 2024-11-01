import type { Component } from 'solid-js'
import { For, Show } from 'solid-js'
import { nameView, textView } from '@/core/commands/script/textbox'
import { useStore } from '@/store/context'
import styles from './TextBox.module.scss'

export const STAR_MARKER = '<star>'

export const TextBox: Component = () => {
    const config = useStore().config

    const lines = () =>
        textView()
            .replace(/<star>$/, '')
            .split('\n')
            .filter((line) => line !== '')
    return (
        <>
            <div class={styles.Game_TextBox_text_container}>
                {/* 因为透明度继承问题,对背景图片进行分离 */}
                <div class={styles.Game_TextBox_text_background} style={{ opacity: 1 - config.TextBoxOpacity() }} />
                <div class={styles.Game_TextBox_text}>
                    {/* tag:有点想用标记实现一些效果,先这样放着 */}
                    <For each={lines()}>
                        {(line, index) => (
                            <>
                                <div>
                                    {line}
                                    <Show when={index() === lines().length - 1 && textView().endsWith(STAR_MARKER)}>
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
