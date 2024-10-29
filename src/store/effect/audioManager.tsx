import { createEffect } from 'solid-js'
import { storePromise } from '../store'
import { Howl, Howler } from 'howler'

storePromise.then((store) => createEffect(() => Howler.volume(store.config.GolbalVolume())))

const configVolumeControllerMapPromise = storePromise.then((store) => ({
    BGM: store.config.BGMVolume,
    SE: store.config.SEVolume,
    Clip: store.config.ClipVolume,
    UISE: store.config.UISEVolume
}))

export function useAudioConfig(type: 'BGM' | 'SE' | 'Clip' | 'UISE', audio: Howl): Howl {
    configVolumeControllerMapPromise.then((map) => createEffect(() => audio.volume(map[type]())))

    // 在离开页面时暂停audio,在返回页面时恢复
    let pausedState = true
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            pausedState = !audio.playing()
            audio.pause()
        }

        if (document.visibilityState === 'visible') {
            if (pausedState === false) {
                audio.play()
            }
        }
    })

    return audio
}
