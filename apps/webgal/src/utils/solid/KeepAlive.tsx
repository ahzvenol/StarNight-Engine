import type { Signal } from 'micro-reactive-solid'
import type { Accessor, Component, ParentProps } from 'solid-js'
import { useSignal } from 'micro-reactive-solid'
import { createEffect, on, runWithOwner, Show } from 'solid-js'
import { KeepAlive, useKeepAlive } from 'solid-keep-alive'

const signals = new Map<string, Signal<number>>()

const KeepAliveX: Component<ParentProps<{ id: string; key: Accessor<unknown> }>> = (props) => {
    const { removeElement } = useKeepAlive()[1]
    if (!signals.has(props.id)) {
        const refresh = useSignal(1)
        signals.set(props.id, refresh)
        // 在实际使用中这个组件会因为上层Show组件开关反复运行
        // 不希望它在初始化时运行effect,也不希望在它销毁时取消effect监听
        runWithOwner(null, () =>
            createEffect(
                on(
                    props.key,
                    () => {
                        removeElement(props.id)
                        if (refresh() === 1) {
                            refresh(-1)
                        } else {
                            refresh(1)
                        }
                    },
                    { defer: true }
                )
            )
        )
    }
    return (
        <Show when={signals.get(props.id)!()} keyed>
            {KeepAlive({
                get id() {
                    return props.id
                },
                get children() {
                    return props.children
                }
            })()}
        </Show>
    )
}

export { KeepAliveX as KeepAlive }
