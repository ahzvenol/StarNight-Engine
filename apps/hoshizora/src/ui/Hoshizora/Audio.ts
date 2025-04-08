import type { Howl, HowlConstructor, HowlOptions } from '@/lib/howler'
import { useSignal } from 'micro-reactive-solid'
import { createEffect } from 'solid-js'
import { HowlerInstance } from '@/lib/howler'
import { onStoreReady } from '@/store'

function suspendWhenDocumentHidden(audio: Howl) {
    let wasPlaying = false
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            wasPlaying = audio.playing()
            audio.pause()
        } else if (wasPlaying) {
            audio.play()
        }
    })
}

// 包装函数，将 suspendWhenDocumentHidden 应用到每个实例
function wrapHowlWithSuspend(HowlClass: HowlConstructor) {
    return function (options: HowlOptions): Howl {
        const howlInstance = new HowlClass(options)
        suspendWhenDocumentHidden(howlInstance)
        return howlInstance
    }
}

const { Howler: HowlerGlobal, Howl: HowlerConstructor } = HowlerInstance()

onStoreReady.then(({ config: { globalvolume } }) => createEffect(() => HowlerGlobal.volume(globalvolume())))

export const Howler = wrapHowlWithSuspend(HowlerConstructor)

export const UISE = (options: HowlOptions) => {
    const howl = Howler(options)
    onStoreReady.then(({ config: { uisevolume } }) => createEffect(() => HowlerGlobal.volume(uisevolume())))
    return howl
}

export const Clip = (options: HowlOptions) => {
    const howl = Howler(options)
    onStoreReady.then(({ config: { clipvolume } }) => createEffect(() => HowlerGlobal.volume(clipvolume())))
    return howl
}

export enum AudioIds {
    Title,
    GalleryAudio,
    GalleryVideo,
    Game
}

export const AudioMutex = useSignal<AudioIds>(AudioIds.Title)
