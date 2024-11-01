import type { Component } from 'solid-js'
import type { Signal } from '@/utils/Reactive'
import { useEvents } from '@/core/Core'
import { router } from '@/router'
import { Button } from '@/ui/Elements'
import { Pages } from '@/ui/Pages'
import styles from './ControlPanel.module.scss'

export const ControlPanel: Component<{ showBacklog: Signal<boolean>; showBottomBox: Signal<boolean> }> = ({
    showBacklog,
    showBottomBox
}) => {
    const { auto, fast } = useEvents()
    return (
        <div class={styles.Game_ControlPanel_container} onClick={(event) => event.stopPropagation()}>
            <div class={styles.Game_ControlPanel_group_1}>
                <Button class={styles.Game_ControlPanel_save} />
                <Button class={styles.Game_ControlPanel_load} />
                <Button class={styles.Game_ControlPanel_quicksave} />
                <Button class={styles.Game_ControlPanel_quickload} />
            </div>
            <div class={styles.Game_ControlPanel_group_2}>
                <Button class={styles.Game_ControlPanel_config} onClick={() => router.navigate(Pages.Config)} />
                <Button class={styles.Game_ControlPanel_backlog} onClick={() => showBacklog(true)} />
                <Button class={styles.Game_ControlPanel_auto} onclick={auto} />
                <Button class={styles.Game_ControlPanel_fast} onclick={fast} />
                <Button class={styles.Game_ControlPanel_hidden} onclick={() => showBottomBox(false)} />
            </div>
        </div>
    )
}
