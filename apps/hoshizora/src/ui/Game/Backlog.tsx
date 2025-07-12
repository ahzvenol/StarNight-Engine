import type { Component } from 'solid-js'
import clsx from 'clsx'
import { For, onMount, Show } from 'solid-js'
import { smartAutoAndFast, ui } from '@/store/starnight'
import { Content } from '@/utils/ui/Elements'
import Scrollbar from '@/utils/ui/Scrollbar'
import { stopPropagation } from '@/utils/solid/stopPropagation'
import { Clip } from '../Audio'
import Back from '../Back/Back'
import { BackIcon, MusicIcon } from '../../../utils/ui/Icon'
import styles from './Backlog.module.scss'
import { restartGame } from './Game'

export const Backlog: Component<{ closeBacklog: Function0<void> }> = ({ closeBacklog }) => {
    onMount(smartAutoAndFast)

    return (
        <Content onClick={stopPropagation} onContextMenu={stopPropagation(() => closeBacklog())}>
            <div class={clsx('Page', styles.Game_Backlog_mask)} />
            <div class={clsx('Page', styles.Game_Backlog_container)}>
                <Scrollbar
                    container={<div class={styles.Game_Backlog_content} />}
                    content={
                        <For each={ui().backlog()}>
                            {(act) => (
                                <div class={styles.Game_Backlog_element}>
                                    <Show when={act.file}>
                                        <div
                                            class={styles.Game_Backlog_element_clip}
                                            onClick={() => Clip({ src: act.file!, autoplay: true })}>
                                            <MusicIcon />
                                        </div>
                                    </Show>
                                    <div
                                        class={styles.Game_Backlog_element_back}
                                        onClick={() => restartGame(act.local)}>
                                        <BackIcon />
                                    </div>
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
