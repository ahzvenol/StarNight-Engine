import type { Component } from 'solid-js'
import { starnight } from '@/store/starnight'
import { suppress } from '@/utils/solid/suppress'
import { store } from '@/store'
import { Button } from '../Button'
import { GUIGameRootState, useGame } from '../GameRoot'
import styles from './ControlPanel.module.scss'
import { showUI } from './Game'

export const ControlPanel: Component = () => {
    const slot = store.local[-1]
    return (
        <div ref={suppress('click')} class={styles.Game_ControlPanel_container}>
            <div class={styles.Game_ControlPanel_group_1}>
                <Button class={styles.Game_ControlPanel_save} onClick={() => GUIGameRootState('Save')} />
                <Button class={styles.Game_ControlPanel_load} onClick={() => GUIGameRootState('Load')} />
                <Button class={styles.Game_ControlPanel_quicksave} onClick={() => slot(starnight().current())} />
                <Button
                    class={styles.Game_ControlPanel_quickload}
                    onClick={() => {
                        if (slot() !== undefined) useGame(slot()!)
                    }}
                />
            </div>
            <div class={styles.Game_ControlPanel_group_2}>
                <Button class={styles.Game_ControlPanel_config} onClick={() => GUIGameRootState('Config')} />
                <Button class={styles.Game_ControlPanel_backlog} onClick={() => GUIGameRootState('Backlog')} />
                <Button
                    class={styles.Game_ControlPanel_auto}
                    style={{ filter: starnight().state.isAuto() ? 'brightness(60%)' : '' }}
                    onClick={() => starnight().ClickEvents.auto.publish()}
                />
                <Button
                    class={styles.Game_ControlPanel_fast}
                    style={{ filter: starnight().state.isFast() ? 'brightness(60%)' : '' }}
                    onClick={() => starnight().ClickEvents.fast.publish()}
                />
                <Button class={styles.Game_ControlPanel_hidden} onClick={() => showUI(false)} />
            </div>
        </div>
    )
}
