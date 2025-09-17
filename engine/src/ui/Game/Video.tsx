import type { Component } from 'solid-js'
import { Content } from '@/utils/ui/Elements'
import { store } from '@/store'
import { ui } from '@/store/starnight'
import { useEventListener } from '@/utils/solid/useEventListener'
import styles from './Video.module.scss'

export const Video: Component = () => {
    const globalvolume = store.config.globalvolume
    return (
        <Content class={styles.Game_Video_container}>
            <video
                ref={(ref) => {
                    ref.volume = globalvolume()
                    useEventListener('visibilitychange', () =>
                        document.visibilityState === 'hidden' ? ref.pause() : ref.play()
                    )
                }}
                src={ui().video()!.src}
                autoplay
                onClick={() => ui().video()?.race?.()}
                onEnded={() => ui().video()?.race?.()}
                // @ts-expect-error 类型上不存在属性
                disablePictureInPicture
            />
        </Content>
    )
}
