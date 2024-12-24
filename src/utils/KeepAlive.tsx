import type { Accessor, Component, ParentProps } from 'solid-js'
import type { Signal } from './Reactive'
import { createEffect, on, runWithOwner } from 'solid-js'
import { KeepAlive, useKeepAlive } from 'solid-keep-alive'
import { useSignal } from './Reactive'
import { ReRender } from './ReRender'

const signals = new Map<string, Signal<number>>()

const KeepAliveX: Component<ParentProps<{ id: string; key: Accessor<number> }>> = (props) => {
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
        <ReRender key={signals.get(props.id)!}>
            {/* @ts-expect-error  返回类型 "() => Element" 不是有效的 JSX 元素。*/}
            <KeepAlive id={props.id}>{props.children}</KeepAlive>
        </ReRender>
    )
}

export { KeepAliveX as KeepAlive }
