import { stageView } from '@/core/commands/script/image'
import { Component } from 'solid-js'
import styles from './Stage.module.scss'

export const Stage: Component = () => {
    return <div class={styles.Stage_container}>{stageView()}</div>
}
