import type { Component } from 'solid-js'
import type { GameUIVideoItem } from '@/scripts/api/video'
import { Content } from '@/utils/ui/Elements'
import { store } from '@/store'
import { useEventListener } from '@/utils/solid/useEventListener'
import styles from './Video.module.scss'

export const Video: Component<{ item: GameUIVideoItem }> = (props) => {
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
                src={props.item!.src}
                autoplay
                onClick={() => {
                    if (props.item.skip) {
                        props.item.resolve()
                    }
                }}
                onEnded={() => props.item.resolve()}
                playsinline
                webkit-playsinline
                // @ts-expect-error 类型上不存在属性
                disablePictureInPicture
            />
        </Content>
    )
}
