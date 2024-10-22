import { Signal } from '@/utils/Reactive'
import { Component } from 'solid-js'
import styles from './ControlPanel.module.scss'
import { router } from '@/router'
import { Pages } from '@/ui/Pages'
import { Button } from '@/ui/Elements'

export const ControlPanel: Component<{ showBacklog: Signal<boolean> }> = ({ showBacklog }) => {
    return (
        <div class={styles.Game_ControlPanel_container}>
            <div class={styles.Game_ControlPanel_group_1}>
                <Button class={styles.Game_ControlPanel_save} />
                <Button class={styles.Game_ControlPanel_load} />
                <Button class={styles.Game_ControlPanel_quicksave} />
                <Button class={styles.Game_ControlPanel_quickload} />
            </div>
            <div class={styles.Game_ControlPanel_group_2}>
                <Button class={styles.Game_ControlPanel_config} onClick={() => router.navigate(Pages.Config)} />
                <Button class={styles.Game_ControlPanel_backlog} onClick={() => showBacklog(true)} />
                <Button class={styles.Game_ControlPanel_auto} />
                <Button class={styles.Game_ControlPanel_fast} />
                <Button class={styles.Game_ControlPanel_hidden} />
            </div>
        </div>
    )
}
