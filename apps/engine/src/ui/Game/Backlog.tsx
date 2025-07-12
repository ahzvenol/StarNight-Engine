import type { Component } from 'solid-js'
import { CloseSmall, Return, VolumeNotice } from 'icon-park-solid'
import { For, Show } from 'solid-js'
import { Variable } from '@/utils/ui/Elements'
import { Scrollbar } from '@/utils/ui/Scrollbar'
import { ui } from '@/store/starnight'
import { GUIGameRootState, useGame } from '@/ui/GameRoot'
import { suppress } from '@/utils/solid/suppress'
import { useSoundEffect } from '../useSoundEffect'
import { translation } from '../translations'
import { Clip } from '../../store/audio'
import styles from './Backlog.module.scss'

export const Backlog: Component = () => {
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
                container={<div class={styles.Game_Backlog_content} />}
                content={(
                    <For each={ui().backlog()}>
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
                                    <Show when={act.clip}>
                                        <Variable value={Clip({ src: act.clip! })}>
                                            {(clip) => (
                                                <div
                                                    ref={useSoundEffect('Click', 'Enter')}
                                                    class={styles.Game_Backlog_item_clip}
                                                    onClick={() => clip.stop().play()}
                                                >
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
                                    <div class={styles.Game_Backlog_item_name}>{act.local.name}</div>
                                </div>
                                <div class={styles.Game_Backlog_item_layout_2}>
                                    <div class={styles.Game_Backlog_item_text} innerHTML={act.text} />
                                </div>
                            </div>
                        )}
                    </For>
                )}
                track={<div class={styles.Game_Backlog_Scrollbar_track} />}
                thumb={<div class={styles.Game_Backlog_Scrollbar_thumb} />}
                default={1}
            />
        </div>
    )
}
