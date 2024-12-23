import type { Component } from 'solid-js'
import { For, Show } from 'solid-js'
import { backlogView } from '@/core/commands/script/backlog'
import { useAudioConfig } from '@/store/hooks/useAudioConfig'
import Scrollbar from '@/ui/Scrollbar'
import Back from '../Back/Back'
import styles from './Backlog.module.scss'

export const Backlog: Component<{ closeBacklog: Function0<void> }> = ({ closeBacklog }) => {
    return (
        <div style={{ display: 'contents' }} onClick={(event) => event.stopPropagation()}>
            <div class={'Page' + ' ' + styles.Game_Backlog_mask} />
            <div class={'Page' + ' ' + styles.Game_Backlog_container}>
                <Scrollbar
                    container={<div class={styles.Game_Backlog_content} />}
                    content={
                        <For each={backlogView()}>
                            {(row) => (
                                <div class={styles.Game_Backlog_element}>
                                    <Show when={row.file}>
                                        <div
                                            class={styles.Game_Backlog_element_clip}
                                            onClick={() =>
                                                useAudioConfig('Clip', new Howl({ src: row.file!, autoplay: true }))
                                            }
                                        />
                                    </Show>
                                    <div class={styles.Game_Backlog_element_name}>{row.name}</div>
                                    <div class={styles.Game_Backlog_element_text}>{row.text}</div>
                                </div>
                            )}
                        </For>
                    }
                    track={<div class={styles.Game_Backlog_Scrollbar_track} />}
                    thumb={<div class={styles.Game_Backlog_Scrollbar_thumb} />}
                    default={1}
                />
                <Back onClick={closeBacklog} />
            </div>
        </div>
    )
}
