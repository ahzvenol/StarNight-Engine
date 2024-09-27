import { Variables } from '@/core/Core'
import { Component, Show } from 'solid-js'
import styles from './TextBox.module.scss'

export const TextBox: Component<{ variables: Variables }> = ({ variables }) => {
    return (
        <>
            <div class={styles.Game_TextBox_container}>
                {/* 因为透明度继承问题,对背景图片进行分离 */}
                <div class={styles.Game_TextBox_background} />
                <div class={styles.Game_TextBox_text}>
                    <span>
                        {/* eslint-disable-next-line solid/no-innerhtml */}
                        <span innerHTML={variables.reactive.textView()?.trim()} />
                        <span class={styles.Game_TextBox_star_container}>
                            {/* todo:当本条文本完整显示,展示star */}
                            <div class={styles.Game_TextBox_star} />
                        </span>
                    </span>
                </div>
            </div>
            <Show when={variables.reactive.nameView() !== undefined}>
                <div class={styles.Game_TextBox_name_background} />
                <div class={styles.Game_TextBox_name}>{variables.reactive.nameView()}</div>
            </Show>
        </>
    )
}
