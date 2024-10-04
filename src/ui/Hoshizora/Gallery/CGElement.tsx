import { useSignal } from '@/utils/Reactive'
import { Getter } from 'micro-reactive'
import { Component, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import styles from './Gallery.module.scss'

export const CGElement: Component<Getter<Array<string>>> = (cg) => {
    const pointer = useSignal(-1)
    const cover = `url(./static/ImageAsset/${cg()[0] + cg()[1]}.png)`
    const isMax = () => pointer() >= cg().length - 1
    const now = () => `url(./static/ImageAsset/${cg()[0] + cg()[pointer()]}.png)`
    const next = () => (isMax() ? '' : `url(./static/ImageAsset/${cg()[0] + cg()[pointer() + 1]}.png)`)
    return (
        <>
            <div
                class={styles.Gallery_content_element}
                style={{
                    'background-image': cover
                }}
                onClick={() => pointer(1)}
            />
            <Show when={pointer() > 0}>
                <Portal mount={document.getElementById(styles.Gallery_CG_container)!}>
                    <div
                        class={styles.Gallery_CG_view}
                        style={{
                            // 预加载下一张cg,避免闪烁的情况
                            'background-image': now() + ',' + next()
                        }}
                        onContextMenu={(event) => (event.stopPropagation(), pointer(-1))}
                        onClick={() => pointer((i) => (isMax() ? -1 : i + 1))}
                    />
                </Portal>
            </Show>
        </>
    )
}
