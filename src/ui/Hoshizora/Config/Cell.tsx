import { Reactive } from 'micro-reactive'
import { Component, ParentProps } from 'solid-js'
import styles from './Cell.module.scss'

const Cell: Component<ParentProps<{ title: Reactive<string> }>> = ({ title, children }) => {
    return (
        <div class={styles.NormalOption} style={{ width: 'auto' }}>
            <div class={styles.NormalOption_title}>{title()}</div>
            <div class={styles.NormalOption_buttonList} style={{ width: 'auto' }}>
                {children}
            </div>
        </div>
    )
}

export default Cell