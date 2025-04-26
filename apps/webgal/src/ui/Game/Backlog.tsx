import type { Component } from 'solid-js'
import { CloseSmall, Return, VolumeNotice } from 'icon-park-solid'
import { For, Show } from 'solid-js'
import { Variable } from '@/core/ui/Elements'
import Scrollbar from '@/core/ui/Scrollbar'
import { ui } from '@/store/starnight'
import { GUIGameRootState, useGame } from '@/ui/GameRoot'
import { stopPropagation } from '@/utils/solid/stopPropagation'
import { Clip } from '../../store/audio'
import { translation } from '../translations'
import { useSoundEffect } from '../useSoundEffect'
import styles from './Backlog.module.scss'

export const Backlog: Component = () => {
    const t = translation.gaming
    return (
        <div
            ref={stopPropagation('contextmenu')}
            class={styles.Game_Backlog_container}
            onContextMenu={() => GUIGameRootState('Game')}>
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
                container={<div class={styles.Game_Backlog_content} />}
                content={
                    <For each={ui().backlog()}>
                        {(act, i) => (
                            <div class={styles.Game_Backlog_item} style={{ 'animation-delay': `${(i() % 20) * 20}ms` }}>
                                <div class={styles.Game_Backlog_item_layout_1}>
                                    <div
                                        ref={useSoundEffect('Click', 'Enter')}
                                        class={styles.Game_Backlog_item_back}
                                        onClick={() => useGame(act.local)}>
                                        <Return theme="outline" size="0.8em" fill="#ffffff" strokeWidth={3} />
                                    </div>
                                    <Show when={act.clip}>
                                        <Variable value={Clip({ src: act.clip! })}>
                                            {(clip) => (
                                                <div
                                                    ref={useSoundEffect('Click', 'Enter')}
                                                    class={styles.Game_Backlog_item_clip}
                                                    onClick={() => clip.stop().play()}>
                                                    <VolumeNotice
                                                        theme="outline"
                                                        size="0.8em"
                                                        fill="#ffffff"
                                                        strokeWidth={3}
                                                    />
                                                </div>
                                            )}
                                        </Variable>
                                    </Show>
                                    <div class={styles.Game_Backlog_item_name}>{act.name}</div>
                                </div>
                                <div class={styles.Game_Backlog_item_layout_2}>
                                    <div class={styles.Game_Backlog_item_text}>{act.text}</div>
                                </div>
                            </div>
                        )}
                    </For>
                }
                track={<div class={styles.Game_Backlog_Scrollbar_track} />}
                thumb={<div class={styles.Game_Backlog_Scrollbar_thumb} />}
                default={1}
            />
        </div>
    )
}
