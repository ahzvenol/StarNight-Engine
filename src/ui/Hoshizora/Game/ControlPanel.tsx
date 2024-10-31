import { Component } from 'solid-js'
import { router } from '@/router'
import { Button } from '@/ui/Elements'
import { Pages } from '@/ui/Pages'
import { Signal } from '@/utils/Reactive'
import styles from './ControlPanel.module.scss'

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
