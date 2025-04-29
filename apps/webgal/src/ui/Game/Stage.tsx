import type { Component } from 'solid-js'
import Scale from '@/core/ui/Scale'
import { ui } from '@/store/starnight'
import styles from './Stage.module.scss'

export const Stage: Component = () => {
    return (
        <Scale width={1280} height={720} mode="auto">
            <div class={styles.Game_Stage_container}>{ui().pixi.view}</div>
        </Scale>
    )
}
