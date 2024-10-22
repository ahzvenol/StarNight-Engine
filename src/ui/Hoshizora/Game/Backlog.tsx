import { Clone } from '@/ui/Elements'
import Scrollbar from '@/ui/Scrollbar'
import { Signal } from '@/utils/Reactive'
import { Component, createEffect, For, Show } from 'solid-js'
import Back from '../Back/Back'
import styles from './Backlog.module.scss'
import { backlogView } from '@/core/commands/script/backlog'
import { createAudioTrack } from '@/store/effect/audioManager'
import { play } from '@/utils/AudioUtil'

export const Backlog: Component<{ showBacklog: Signal<boolean> }> = ({ showBacklog }) => {
    createEffect(() => {
        console.log(backlogView())
    })
    return (
        <>
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
                                            onClick={() => play(createAudioTrack('Clip'))(row.file!)}
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
                <Back onClick={() => showBacklog(false)} />
            </div>
        </>
    )
}
