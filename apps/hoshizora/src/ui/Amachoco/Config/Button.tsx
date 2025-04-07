import type { Reactive } from 'micro-reactive-solid'
import type { Component } from 'solid-js'
import clsx from 'clsx'
import styles from './Config.module.scss'

const BinaryButton: Component<{ signal: Reactive<boolean> }> = ({ signal: item }) => {
    return (
        <>
            <div
                class={clsx(styles.Config_button_full_screen, styles.Config_button_full_screen_off)}
                onClick={() => item(true)}
            />
            <div
                class={clsx(styles.Config_button_full_screen, styles.Config_button_full_screen_on)}
                style={{
                    opacity: item() ? 1 : 0,
                    'pointer-events': item() ? 'auto' : 'none'
                }}
                onClick={() => item(false)}
            />
        </>
    )
}

const GroupButton: Component<{ signal: Reactive<boolean> }> = ({ signal: item }) => {
    return (
        <>
            <div class={clsx(styles.Config_button, styles.Config_button_on_off)} onClick={() => item(true)} />
            <div
                class={clsx(styles.Config_button, styles.Config_button_on_on)}
                style={{ opacity: item() ? 1 : 0, 'pointer-events': item() ? 'auto' : 'none' }}
                onClick={() => item(false)}
            />
            <div
                class={clsx(styles.Config_button, styles.Config_button_off, styles.Config_button_off_off)}
                onClick={() => item(false)}
            />
            <div
                class={clsx(styles.Config_button, styles.Config_button_off, styles.Config_button_off_on)}
                style={{ opacity: !item() ? 1 : 0, 'pointer-events': !item() ? 'auto' : 'none' }}
                onClick={() => item(true)}
            />
        </>
    )
}

export { GroupButton, BinaryButton }
