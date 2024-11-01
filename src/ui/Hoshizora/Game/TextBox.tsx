import type { Component } from 'solid-js'
import { Show } from 'solid-js'
import { nameView, textView } from '@/core/commands/script/textbox'
import { useStore } from '@/store/context'
import styles from './TextBox.module.scss'

export const STAR_MARKER = '<star>'

export const TextBox: Component = () => {
    const config = useStore().config
    return (
        <>
            <div class={styles.Game_TextBox_text_container}>
                {/* 因为透明度继承问题,对背景图片进行分离 */}
                <div class={styles.Game_TextBox_text_background} style={{ opacity: 1 - config.TextBoxOpacity() }} />
                <div class={styles.Game_TextBox_text}>
                    {/* tag:有点想用标记实现一些效果,先这样放着 */}
                    {textView().replace(/<star>$/, '')}
                    <Show when={textView().endsWith(STAR_MARKER)}>
                        <span class={styles.Game_TextBox_star} />
                    </Show>
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
