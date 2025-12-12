import type { Component } from 'solid-js'
import type { BacklogActData } from '@/scripts/api/say/base'
import { CloseSmall, Return, VolumeNotice } from 'icon-park-solid'
import { For, onCleanup, Show } from 'solid-js'
import { once } from 'es-toolkit'
import { Scrollbar } from '@/utils/ui/Scrollbar'
import { GUIGameRootState, useGame } from '@/views/GameRoot'
import { suppress } from '@/utils/solid/suppress'
import { translation } from '@/locales'
import { useSoundEffect } from '../useSoundEffect'
import { Clip } from '../../store/audio'
import styles from './Backlog.module.scss'

const ClipNode: Component<{ src: string }> = ({ src }) => {
    const clip = once(() => new Clip({ src }))
    onCleanup(() => clip().unload())
    return (
        <div
            ref={useSoundEffect('Click', 'Enter')}
            class={styles.Game_Backlog_item_clip}
            onClick={() => clip().stop().play()}
        >
            <VolumeNotice
                theme="outline"
                size="0.8em"
                fill="#ffffff"
                strokeWidth={3}
            />
        </div>
    )
}

export const Backlog: Component<{ backlog: Array<BacklogActData> }> = (props) => {
    const t = translation.gaming
    return (
        <div
            ref={suppress('contextmenu')}
            class={styles.Game_Backlog_container}
            onContextMenu={() => GUIGameRootState('Game')}
        >
            <div ref={useSoundEffect('Click', 'Enter')} class={styles.Game_Backlog_top}>
                <CloseSmall
                    class={styles.Game_Backlog_top_icon}
                    onClick={() => GUIGameRootState('Game')}
                    theme="outline"
                    size="4em"
                    fill="#ffffff"
                    strokeWidth={3}
                />
                <div class={styles.Game_Backlog_top_title}>{t.buttons.backlog()}</div>
            </div>
            <Scrollbar
                default={1}
                container={<div class={styles.Game_Backlog_content} />}
                track={<div class={styles.Game_Backlog_Scrollbar_track} />}
                thumb={<div class={styles.Game_Backlog_Scrollbar_thumb} />}
                content={(
                    <For each={props.backlog}>
                        {(act, i) => (
                            <div class={styles.Game_Backlog_item} style={{ 'animation-delay': `${(i() % 20) * 20}ms` }}>
                                <div class={styles.Game_Backlog_item_layout_1}>
                                    <div
                                        ref={useSoundEffect('Click', 'Enter')}
                                        class={styles.Game_Backlog_item_back}
                                        onClick={() => useGame(act.local)}
                                    >
                                        <Return theme="outline" size="0.8em" fill="#ffffff" strokeWidth={3} />
                                    </div>
                                    <Show when={act.clip}> <ClipNode src={act.clip!} /> </Show>
                                    <div class={styles.Game_Backlog_item_name}>{act.name}</div>
                                </div>
                                <div class={styles.Game_Backlog_item_layout_2}>
                                    <div class={styles.Game_Backlog_item_text} innerHTML={act.text} />
                                </div>
                            </div>
                        )}
                    </For>
                )}
            />
        </div>
    )
}
