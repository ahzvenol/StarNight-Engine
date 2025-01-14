import type { Howl } from 'howler'
import { createEffect } from 'solid-js'
import { AppEnterEvent, AppLeaveEvent } from '@/core/event'
import { storePromise } from '../store'

const volumeConfigMapPromise = storePromise.then((store) => ({
    BGM: store.config.bgmvolume,
    SE: store.config.sevolume,
    Clip: store.config.clipvolume,
    UISE: store.config.uisevolume
}))

export type AudioTracksType = keyof Awaited<typeof volumeConfigMapPromise>

export function useVolumeBinding(type: AudioTracksType, audio: Howl): Howl {
    volumeConfigMapPromise.then((map) => createEffect(() => audio.volume(map[type]())))

    return audio
}

export function useAudio(type: AudioTracksType, audio: Howl): Howl {
    useVolumeBinding(type, audio)

    // 在离开页面时暂停audio,在返回页面时恢复
    let wasPlaying = false
    AppLeaveEvent.subscribe(() => {
        wasPlaying = audio.playing()
        audio.pause()
    })
    AppEnterEvent.subscribe(() => {
        if (wasPlaying) {
            audio.play()
        }
    })

    return audio
}
