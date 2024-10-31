import { Howl, Howler } from 'howler'
import { createEffect } from 'solid-js'
import { useEventListener } from '@/utils/useEventListener'
import { storePromise } from '../store'

storePromise.then((store) => createEffect(() => Howler.volume(store.config.GolbalVolume())))

const configVolumeControllerMapPromise = storePromise.then((store) => ({
    BGM: store.config.BGMVolume,
    SE: store.config.SEVolume,
    Clip: store.config.ClipVolume,
    UISE: store.config.UISEVolume
}))

export type AudioTracksType = 'BGM' | 'SE' | 'Clip' | 'UISE'

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
