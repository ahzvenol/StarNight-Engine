import { Component, Show } from 'solid-js'
import styles from './TextBox.module.scss'
import { nameView, textView } from '@/core/commands/script/textbox'
import { useStore } from '@/store/context'

export const TextBox: Component = () => {
    const config = useStore().config
    return (
        <>
            <div class={styles.Game_TextBox_text_container}>
                {/* 因为透明度继承问题,对背景图片进行分离 */}
                <div class={styles.Game_TextBox_text_background} style={{ opacity: 1 - config.TextBoxOpacity() }} />
                <div class={styles.Game_TextBox_text}>
                    <span>
                        {/* eslint-disable-next-line solid/no-innerhtml */}
                        <span innerHTML={textView()} />
                        <span class={styles.Game_TextBox_star_container}>
                            {/* todo:当本条文本完整显示,展示star */}
                            <div class={styles.Game_TextBox_star} />
                        </span>
                    </span>
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
