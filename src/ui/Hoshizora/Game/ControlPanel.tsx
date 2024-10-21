import { Signal } from '@/utils/Reactive'
import { Component } from 'solid-js'
import styles from './ControlPanel.module.scss'
import { router } from '@/router'
import { Pages } from '@/ui/Pages'

export const ControlPanel: Component<{ showBacklog: Signal<boolean> }> = ({ showBacklog }) => {
    return (
        <div class={styles.Game_ControlPanel_container}>
            <div class={styles.Game_ControlPanel_group_1}>
                <div class={styles.Game_ControlPanel_save} />
                <div class={styles.Game_ControlPanel_load} />
                <div class={styles.Game_ControlPanel_quicksave} />
                <div class={styles.Game_ControlPanel_quickload} />
            </div>
            <div class={styles.Game_ControlPanel_group_2}>
                <div class={styles.Game_ControlPanel_config} onClick={() => router.navigate(Pages.Config)} />
                <div class={styles.Game_ControlPanel_backlog} onClick={() => showBacklog(true)} />
                <div class={styles.Game_ControlPanel_auto} />
                <div class={styles.Game_ControlPanel_fast} />
                <div class={styles.Game_ControlPanel_hidden} />
            </div>
        </div>
    )
}
