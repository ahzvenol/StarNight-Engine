import type { Howl, HowlConstructor, HowlOptions } from '@/lib/howler'
import { useSignal } from 'micro-reactive-solid'
import { Component, createEffect, createMemo, on } from 'solid-js'
import { HowlerInstance } from '@/lib/howler'
import { onStoreReady } from '@/store'
import { useEventListener } from '@/utils/solid/useEventListener'

export enum AudioIds {
    Title,
    GalleryAudio,
    GalleryVideo,
    Game
}

export const AudioMutex = useSignal<AudioIds>(AudioIds.Title)

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
const { Howler: BGMGlobal, Howl: BGMConstructor } = HowlerInstance()
const { Howler: SEGlobal, Howl: SEConstructor } = HowlerInstance()
const { Howler: ClipGlobal, Howl: ClipConstructor } = HowlerInstance()
const { Howler: UISEGlobal, Howl: UISEConstructor } = HowlerInstance()

export const Howler = wrapHowlWithSuspend(HowlerConstructor)
export const BGM = wrapHowlWithSuspend(BGMConstructor)
export const SE = wrapHowlWithSuspend(SEConstructor)
export const Clip = wrapHowlWithSuspend(ClipConstructor)
export const UISE = wrapHowlWithSuspend(UISEConstructor)

onStoreReady.then(({ config: { globalvolume, bgmvolume, sevolume, clipvolume, uisevolume } }) => {
    createEffect(() => HowlerGlobal.volume(globalvolume()))
    createEffect(() => BGMGlobal.volume(globalvolume() * bgmvolume()))
    createEffect(() => SEGlobal.volume(globalvolume() * sevolume()))
    createEffect(() => ClipGlobal.volume(globalvolume() * clipvolume()))
    createEffect(() => UISEGlobal.volume(globalvolume() * uisevolume()))
})

const HowlC: Component<HowlOptions> = (props) => {
    const howl = createMemo(() => Howler(props))

    useEventListener('visibilitychange', () => (document.visibilityState === 'hidden' ? howl().pause() : howl().play()))
q@q1q@q1
    createEffect(
        on(
            howl,
            (now, prev) => {
                prev?.unload()
                now.play()
            },
            { defer: true }
        )
    )

    return null
}
