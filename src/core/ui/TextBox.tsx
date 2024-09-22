import { Component, Show } from 'solid-js'
import { Variables } from '../Core'
import styles from './TextBox.module.scss'

export const TextBox: Component<{ variables: Variables }> = ({ variables }) => {
    return (
        <>
            <div class={styles.TextBox_Container}>
                {/* 因为透明度继承问题,对背景进行分离 */}
                <div class={styles.TextBox_Background}></div>
                <div class={styles.TextBox_main}>
                    <span>
                        <span innerHTML={variables.reactive.textView().trim()} />
                        {/* <span class={styles.star_container}> */}
                        {/* todo:当本条文本完整显示,展示star */}
                        {/* <div class={styles.star} /> */}
                        {/* </span> */}
                    </span>
                </div>
            </div>
            <Show when={variables.reactive.nameView() !== undefined}>
                <div class={styles.TextBox_Name} />
                <div class={styles.TextBox_Name_Background}>{variables.reactive.nameView()}</div>
            </Show>
        </>
    )
}
