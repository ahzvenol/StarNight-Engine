import type { Component } from 'solid-js'
import clsx from 'clsx'
import { For, Show } from 'solid-js'
import { ui } from '@/store/starnight'
import { Content } from '@/utils/ui/Elements'
import { Scrollbar } from '@/utils/ui/Scrollbar'
import { suppress } from '@/utils/solid/suppress'
import { Clip } from '@/store/audio'
import { BackIcon, MusicIcon } from '../../utils/ui/Icon'
import { useGame } from '../GameRoot'
import styles from './Backlog.module.scss'

export const Backlog: Component = () => {
    return (
        <Content ref={suppress('click', 'contextmenu')}>
            <div class={clsx('Page', styles.Game_Backlog_mask)} />
            <div class={clsx('Page', styles.Game_Backlog_container)}>
                <Scrollbar
                    container={<div class={styles.Game_Backlog_content} />}
                    content={(
                        <For each={ui().backlog()}>
                            {(act) => (
                                <div class={styles.Game_Backlog_element}>
                                    <Show when={act.clip}>
                                        <div
                                            class={styles.Game_Backlog_element_clip}
                                            onClick={() => Clip({ src: act.clip!, autoplay: true })}
                                        >
                                            <MusicIcon />
                                        </div>
                                    </Show>
                                    <div
                                        class={styles.Game_Backlog_element_back}
                                        onClick={() => useGame(act.local)}
                                    >
                                        <BackIcon />
                                    </div>
                                    <div class={styles.Game_Backlog_element_name}>{act.local.name}</div>
                                    <div class={styles.Game_Backlog_element_text}>{act.text}</div>
                                </div>
                            )}
                        </For>
                    )}
                    track={<div class={styles.Game_Backlog_Scrollbar_track} />}
                    thumb={<div class={styles.Game_Backlog_Scrollbar_thumb} />}
                    default={1}
                />
            </div>
        </Content>
    )
}
