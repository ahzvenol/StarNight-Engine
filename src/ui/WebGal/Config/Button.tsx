import type { Reactive } from 'micro-reactive'
import clsx from 'clsx'
import { createSelector, splitProps } from 'solid-js'
import { Button as BaseButton } from '@/ui/Elements'
import styles from './Button.module.scss'

function Button<T>(props: { key: T; signal: Reactive<T> } & Parameters<typeof BaseButton>[0]) {
    const [local, others] = splitProps(props, ['key', 'signal', 'class', 'onClick'])
    const isSelected = createSelector<T>(local.signal)
    return (
        <BaseButton
            class={clsx(local.class, styles.NormalButton, { [styles.NormalButtonChecked]: isSelected(local.key) })}
            onClick={() => {
                local.signal(local.key)
                local.onClick?.()
            }}
            {...others}
        />
    )
}

export default Button
