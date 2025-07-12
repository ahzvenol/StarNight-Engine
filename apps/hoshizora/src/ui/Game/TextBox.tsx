import type { Component } from 'solid-js'
import { For, Show } from 'solid-js'
import { starnight, ui } from '@/store/starnight'
import { store } from '@/store'
import styles from './TextBox.module.scss'

export const TextBox: Component = () => {
    const config = store.config

    const lines = () =>
        ui()
            .text()
            .split('\n')
            .filter((line) => line !== '')

    return (
        <>
            <div class={styles.Game_TextBox_text_container}>
                {/* 因为透明度继承问题,对背景图片进行分离 */}
                <div class={styles.Game_TextBox_text_background} style={{ opacity: 1 - config.textboxopacity() }} />
                <div class={styles.Game_TextBox_text} style={{ color: starnight().isRead() ? '#96c7ec' : '#ffffff' }}>
                    <For each={lines()}>
                        {(line, index) => (
                            <>
                                <div>
                                    {line}
                                    <Show when={index() === lines().length - 1 && ui().iconstate()}>
                                        <span class={styles.Game_TextBox_star_container}>
                                            <span class={styles.Game_TextBox_star} />
                                        </span>
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
            <Show when={ui().name() !== ''}>
                <div class={styles.Game_TextBox_name_container}>
                    <div class={styles.Game_TextBox_name_background} style={{ opacity: 1 - config.textboxopacity() }} />
                    <div
                        class={styles.Game_TextBox_name}
                        style={{ color: starnight().isRead() ? '#94c6ec' : '#ffffff' }}
                    >
                        {ui().name()}
                    </div>
                </div>
            </Show>
        </>
    )
}
