import type { Accessor, Component, JSX } from 'solid-js'
import { useSignal } from 'micro-reactive-solid'
import { createEffect, on } from 'solid-js'

// 该组件不稳定
export const ReRender: Component<{ key: Accessor<unknown>; children: JSX.Element }> = (props) => {
    const children = useSignal(props.children)
    createEffect(on(props.key, () => children(props.children), { defer: true }))
    return children as unknown as JSX.Element
}
