import type { Component } from 'solid-js'
import { useEvents, useState } from '@/core/Core'
import { getSave } from '@/core/save'
import { State } from '@/core/type'
import { router } from '@/router'
import { useStore } from '@/store/context'
import { Button } from '@/ui/Elements'
import { Pages, restartGame } from '@/ui/Pages'
import styles from './ControlPanel.module.scss'

export const ControlPanel: Component<{ showBacklog: Function0<void>; closeBottomBox: Function0<void> }> = ({
    showBacklog,
    closeBottomBox
}) => {
    const state = useState()
    const { auto, fast } = useEvents()
    const quickSave = useStore().save.local[0]
    return (
        <div class={styles.Game_ControlPanel_container} onClick={(event) => event.stopPropagation()}>
            <div class={styles.Game_ControlPanel_group_1}>
                <Button class={styles.Game_ControlPanel_save} onClick={() => router.navigate(Pages.Save)} />
                <Button class={styles.Game_ControlPanel_load} onClick={() => router.navigate(Pages.Load)} />
                <Button class={styles.Game_ControlPanel_quicksave} onClick={() => quickSave(getSave())} />
                <Button
                    class={styles.Game_ControlPanel_quickload}
                    onclick={() => quickSave() && restartGame(quickSave()!)}
                />
            </div>
            <div class={styles.Game_ControlPanel_group_2}>
                <Button class={styles.Game_ControlPanel_config} onClick={() => router.navigate(Pages.Config)} />
                <Button class={styles.Game_ControlPanel_backlog} onClick={showBacklog} />
                <Button
                    class={styles.Game_ControlPanel_auto}
                    style={{ filter: state() === State.Auto ? 'brightness(60%)' : '' }}
                    onClick={auto}
                />
                <Button
                    class={styles.Game_ControlPanel_fast}
                    style={{ filter: state() === State.Fast ? 'brightness(60%)' : '' }}
                    onClick={fast}
                />
                <Button class={styles.Game_ControlPanel_hidden} onClick={closeBottomBox} />
            </div>
        </div>
    )
}
