import type { Component } from 'solid-js'
import type { MVEntry } from '@/store/gallery'
import { useSignal } from 'micro-reactive-solid'
import { Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import { AudioMutex } from '@/store/audio'
import { store } from '@/store'
import { CGMountPoint } from './Gallery'
import styles from './Gallery.module.scss'

export const MVElement: Component<{ entry: MVEntry }> = ({ entry }) => {
    const unlocked = store.global.unlocked
    const canShow = entry.item.condition === undefined || entry.item.condition instanceof Array
        ? !entry.item.condition!.some((e) => !unlocked().includes(e))
        : unlocked().includes(entry.item.condition)
    const pointer = useSignal(-1)
    return (
        <>
            <div
                class={styles.Gallery_content_cg_element}
                style={{
                    'background-image': canShow ? `url(${entry.cover})` : `url(${entry.uncover})`
                }}
                onClick={() => {
                    if (canShow) {
                        AudioMutex('GalleryVideo')
                        pointer(0)
                    }
                }}
            />
            <Show when={pointer() >= 0}>
                <Portal mount={document.getElementById(CGMountPoint)!}>
                    <video
                        class={styles.Gallery_VCG_view}
                        src={entry.item.url}
                        autoplay
                        onClick={() => pointer(-1)}
                        onEnded={() => pointer(-1)}
                        // @ts-expect-error 类型上不存在属性
                        disablePictureInPicture
                    />
                </Portal>
            </Show>
        </>
    )
}
