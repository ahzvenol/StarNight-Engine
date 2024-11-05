import type { Component, ParentProps } from 'solid-js'
import type { Signal } from './Reactive'
import { createEffect, on, runWithOwner, Show } from 'solid-js'
import { KeepAlive, useKeepAlive } from 'solid-keep-alive'
import { useSignal } from './Reactive'

const efftct = new Map<string, Signal<number>>()

const KeepAliveX: Component<ParentProps<{ id: string; key: Signal<number> }>> = (props) => {
    const { removeElement } = useKeepAlive()[1]
    if (!efftct.has(props.id)) {
        efftct.set(props.id, useSignal(1))
        // 在实际使用中这个组件会因为上层Show组件开关反复运行
        // 不希望它在初始化时运行effect,也不希望在它销毁时effect监听取消
        runWithOwner(null, () =>
            createEffect(
                on(
                    props.key,
                    () => {
                        removeElement(props.id)
                        efftct.get(props.id)!(0)
                        setTimeout(() => {
                            efftct.get(props.id)!(1)
                        })
                    },
                    { defer: true }
                )
            )
        )
    }
    return (
        <Show when={efftct.get(props.id)!() === 1}>
            {/* @ts-expect-error  返回类型 "() => Element" 不是有效的 JSX 元素。*/}
            <KeepAlive id={props.id}>{props.children}</KeepAlive>
        </Show>
    )
}

export { KeepAliveX as KeepAlive }
