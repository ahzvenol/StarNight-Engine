import type { Component } from 'solid-js'
import clsx from 'clsx'
import { For, onCleanup, onMount, Show } from 'solid-js'
import { backlogView } from '@/core/commands/script/backlog'
import { GameActivateEvent, GameDeactivateEvent } from '@/core/event'
import { Clip } from '@/store/audio'
import { Content } from '@/ui/Elements'
import Scrollbar from '@/ui/Scrollbar'
import { stopPropagation } from '@/utils/solid/stopPropagation'
import Back from '../Back/Back'
import styles from './Backlog.module.scss'

export const Backlog: Component<{ closeBacklog: Function0<void> }> = ({ closeBacklog }) => {
    onMount(GameDeactivateEvent.publish)
    onCleanup(GameActivateEvent.publish)
    return (
        <Content onClick={stopPropagation} onContextMenu={stopPropagation(() => closeBacklog())}>
            <div class={clsx('Page', styles.Game_Backlog_mask)} />
            <div class={clsx('Page', styles.Game_Backlog_container)}>
                <Scrollbar
                    container={<div class={styles.Game_Backlog_content} />}
                    content={
                        <For each={backlogView()}>
                            {(act) => (
                                <div class={styles.Game_Backlog_element}>
                                    <Show when={act.file}>
                                        <div
                                            class={styles.Game_Backlog_element_clip}
                                            onClick={() => Clip({ src: act.file!, autoplay: true })}
                                        />
                                    </Show>
                                    <div class={styles.Game_Backlog_element_name}>{act.name}</div>
                                    <div class={styles.Game_Backlog_element_text}>{act.text}</div>
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
        </Content>
    )
}
