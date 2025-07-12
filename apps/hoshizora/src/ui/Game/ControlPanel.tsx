import type { Component } from 'solid-js'
import { router } from '@/router'
import { useStore } from '@/store/context'
import { starnight } from '@/store/starnight'
import { stopPropagation } from '@/utils/solid/stopPropagation'
import { Button } from '../Button'
import { Pages } from '../Pages'
import styles from './ControlPanel.module.scss'
import { restartGame } from './Game'

export const ControlPanel: Component<{ showBacklog: Function0<void>; closeBottomBox: Function0<void> }> = ({
    showBacklog,
    closeBottomBox
}) => {
    const slot = useStore().local[-1]
    return (
        <div class={styles.Game_ControlPanel_container} onClick={stopPropagation}>
            <div class={styles.Game_ControlPanel_group_1}>
                <Button class={styles.Game_ControlPanel_save} onClick={() => router.navigate(Pages.Save)} />
                <Button class={styles.Game_ControlPanel_load} onClick={() => router.navigate(Pages.Load)} />
                <Button class={styles.Game_ControlPanel_quicksave} onClick={() => slot(starnight().current())} />
                <Button
                    class={styles.Game_ControlPanel_quickload}
                    onClick={() => {
                        console.log(slot())
                        if (slot() !== undefined) restartGame(slot()!)
                    }}
                />
            </div>
            <div class={styles.Game_ControlPanel_group_2}>
                <Button class={styles.Game_ControlPanel_config} onClick={() => router.navigate(Pages.Config)} />
                <Button class={styles.Game_ControlPanel_backlog} onClick={showBacklog} />
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
                <Button class={styles.Game_ControlPanel_hidden} onClick={closeBottomBox} />
            </div>
        </div>
    )
}
