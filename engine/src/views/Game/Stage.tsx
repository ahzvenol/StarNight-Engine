import type { Component } from 'solid-js'
import styles from './Stage.module.scss'

export const Stage: Component<{ view: HTMLCanvasElement }> = (props) => {
    return (
        <div class={styles.Game_Stage_container}>{props.view}</div>
    )
}
