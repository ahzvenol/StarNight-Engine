import type { Reactive } from 'micro-reactive-solid'
import type { JSX } from 'solid-js'
import clsx from 'clsx'
import { createSelector, splitProps } from 'solid-js'
import { useEventListener } from '@/utils/solid/useEventListener'
import { useSoundEffect } from '../useSoundEffect'
import styles from './Button.module.scss'

export function Button<T>(props: { key: T, signal: Reactive<T> } & Omit<JSX.HTMLAttributes<HTMLDivElement>, 'ref'>) {
    const [local, others] = splitProps(props, ['class', 'signal', 'key'])
    const isSelected = createSelector<T>(local.signal)
    return (
        <div
            ref={(ref) => {
                useSoundEffect('Switch', 'Enter')(ref)
                useEventListener('click', () => local.signal(() => local.key), { target: ref })
            }}
            class={clsx(local.class, styles.Config_Button, { [styles.Config_Button_checked]: isSelected(local.key) })}
            {...others}
        />
    )
}
