import type { Howl } from 'howler'
import { createEffect } from 'solid-js'
import { useEventListener } from '@/utils/hooks/useEventListener'
import { storePromise } from '../store'

const configVolumeControllerMapPromise = storePromise.then((store) => ({
    BGM: store.config.bgmvolume,
    SE: store.config.sevolume,
    Clip: store.config.clipvolume,
    UISE: store.config.uisevolume
}))

export type AudioTracksType = keyof Awaited<typeof configVolumeControllerMapPromise>

export function useAudioConfig(type: AudioTracksType, audio: Howl): Howl {
    configVolumeControllerMapPromise.then((map) => createEffect(() => audio.volume(map[type]())))

    // 在离开页面时暂停audio,在返回页面时恢复
    let wasPlaying = false
    useEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            wasPlaying = audio.playing()
            audio.pause()
        }

        if (document.visibilityState === 'visible' && wasPlaying) {
            audio.play()
        }
    })
    return audio
}
