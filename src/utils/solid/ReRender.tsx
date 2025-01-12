import type { Accessor, Component, JSX } from 'solid-js'
import { createEffect, on } from 'solid-js'
import { useSignal } from '../Reactive'

export const ReRender: Component<{ key: Accessor<unknown>; children: JSX.Element }> = (props) => {
    const children = useSignal(props.children)
    createEffect(on(props.key, () => children(props.children), { defer: true }))
    return children as unknown as JSX.Element
}
