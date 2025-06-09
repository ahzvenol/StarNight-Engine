import type { Component } from 'solid-js'
import { ui } from '@/store/starnight'
import styles from './Stage.module.scss'

export const Stage: Component = () => {
    return (
        <div class={styles.Game_Stage_container}>{ui().view}</div>
    )
}
