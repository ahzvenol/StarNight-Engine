import { useVariables } from '@/core/Core'
import { Component, Show } from 'solid-js'
import styles from './TextBox.module.scss'

export const TextBox: Component = () => {
    const reactive = useVariables().reactive
    return (
        <>
            <div class={styles.Game_TextBox_container}>
                {/* 因为透明度继承问题,对背景图片进行分离 */}
                <div class={styles.Game_TextBox_background} />
                <div class={styles.Game_TextBox_text}>
                    <span>
                        <span innerHTML={reactive.textView()?.trim()} />
                        <span class={styles.Game_TextBox_star_container}>
                            {/* todo:当本条文本完整显示,展示star */}
                            <div class={styles.Game_TextBox_star} />
                        </span>
                    </span>
                </div>
            </div>
            <Show when={reactive.nameView() !== undefined}>
                <div class={styles.Game_TextBox_name_background} />
                <div class={styles.Game_TextBox_name}>{reactive.nameView()}</div>
            </Show>
        </>
    )
}
