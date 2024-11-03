import type { Component, ParentProps } from 'solid-js'
import type { Signal } from './Reactive'
import { createEffect, on, Show } from 'solid-js'
import { KeepAlive, useKeepAlive } from 'solid-keep-alive'
import { useSignal } from './Reactive'

const KeepAliveX: Component<ParentProps<{ id: string; key: Signal<number> }>> = (props) => {
    const refresh = useSignal(1)
    const { removeElement } = useKeepAlive()[1]
    createEffect(
        on(props.key, () => {
            removeElement(props.id)
            refresh(0)
            setTimeout(() => {
                refresh(1)
            })
        })
    )
    return (
        <Show when={refresh() === 1}>
            {/* @ts-expect-error  返回类型 "() => Element" 不是有效的 JSX 元素。*/}
            <KeepAlive id={props.id}>{props.children}</KeepAlive>
        </Show>
    )
}

export { KeepAliveX as KeepAlive }
