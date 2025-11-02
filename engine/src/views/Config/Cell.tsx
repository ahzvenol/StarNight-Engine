import type { Reactive } from 'micro-reactive-solid'
import type { Component, ParentProps } from 'solid-js'
import styles from './Cell.module.scss'

export const Cell: Component<ParentProps<{ title: Reactive<string> }>> = ({ title, children }) => {
    return (
        <div class={styles.Config_Cell_container} style={{ width: 'auto' }}>
            <div class={styles.Config_Cell_title}>{title()}</div>
            <div class={styles.Config_Cell_button_list} style={{ width: 'auto' }}>
                {children}
            </div>
        </div>
    )
}
