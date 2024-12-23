import type { Accessor, Component, JSX } from 'solid-js'
import { createEffect, on, Show } from 'solid-js'
import { useSignal } from './Reactive'

export const ReRender: Component<{ key: Accessor<unknown>; children: Function0<JSX.Element> }> = (props) => {
    const refresh = useSignal(1)
    createEffect(
        on(
            props.key,
            () => {
                if (refresh() === 1) {
                    refresh(-1)
                } else {
                    refresh(1)
                }
            },
            { defer: false }
        )
    )
    return (
        <Show when={refresh()} keyed>
            {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
            {(_) => <>{props.children()}</>}
        </Show>
    )
}
