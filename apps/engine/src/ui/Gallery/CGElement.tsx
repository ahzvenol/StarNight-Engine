import type { Component } from 'solid-js'
import type { GalleryGroup } from '@/store/gallery'
import { useSignal } from 'micro-reactive-solid'
import { Show } from 'solid-js'
import { store } from '@/store'
import { stopPropagation } from '@/utils/solid/stopPropagation'
import { useSoundEffect } from '../useSoundEffect'
import styles from './GalleryCG.module.scss'

export const CGElement: Component<{ i: number, cgs: GalleryGroup }> = ({ i, cgs }) => {
    const unlocked = store.global.unlocked
    const unlockedItems = cgs.items.filter((item) =>
        item.condition === undefined || item.condition instanceof Array
            ? !item.condition!.some((e) => !unlocked().includes(e))
            : unlocked().includes(item.condition)
    )
    const pointer = useSignal(-1)
    const canShow = unlockedItems.length > 0
    const isMax = () => pointer() >= unlockedItems.length - 1
    const now = () => `url(${unlockedItems[pointer()].url})`
    const next = () => (isMax() ? '' : `,url(${unlockedItems[pointer() + 1].url})`)
    return (
        <Show when={canShow || cgs.uncover !== undefined}>
            <div
                ref={useSoundEffect('Click', 'Enter')}
                class={styles.Gallery_CG_content_element}
                style={{
                    'animation-delay': `${100 + i * 60}ms`
                }}
                onClick={() => {
                    if (canShow) pointer(0)
                }}
            >
                <div
                    class={styles.Gallery_CG_content_element_image}
                    style={{ 'background-image': canShow ? `url(${cgs.cover})` : `url(${cgs.uncover})` }}
                />
            </div>
            <Show when={pointer() >= 0}>
                <div
                    ref={useSoundEffect('Click', 'Enter')}
                    class={styles.Gallery_CG_view_container}
                    onClick={() => pointer(-1)}
                >
                    <div
                        ref={stopPropagation('contextmenu', 'click')}
                        class={styles.Gallery_CG_view}
                        onContextMenu={() => pointer(-1)}
                        onClick={() => pointer((i) => (isMax() ? -1 : i + 1))}
                    >
                        <div
                            class={styles.Gallery_CG_view_image}
                            // 预加载下一张cg,避免闪烁的情况
                            style={{ 'background-image': now() + next() }}
                        />
                    </div>
                </div>
            </Show>
        </Show>
    )
}
