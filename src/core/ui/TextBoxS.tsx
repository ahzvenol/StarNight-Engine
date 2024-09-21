import { Component, Show } from "solid-js"
import { Variables } from "../Core"
import styles from './TextBoxS.module.scss'

export const TextBox: Component<{ variables: Variables }> = ({ variables }) => {
    return <>
        <div class={styles.text_container}>
            {/* 因为透明度继承问题,对背景图片进行分离 */}
            <div class={styles.text_pic}></div>
            <div class={styles.text}>
                <span>
                    <span innerHTML={variables.reactive.textView().trim()} />
                    <span class={styles.star_container}>
                        {/* todo:当本条文本完整显示,展示star */}
                        <div class={styles.star} />
                    </span>
                </span>
            </div>
        </div>
        <Show when={variables.reactive.nameView() !== undefined}>
            <div class={styles.name_pic} />
            <div class={styles.name}>
                {variables.reactive.nameView()}
            </div>
        </Show>
    </>
}
