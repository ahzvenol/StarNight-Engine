import { createEffect } from 'solid-js'
import { HowlerInstance } from '@/lib/howler'
import { onStoreReady } from '@/store/index'

declare module '@/lib/howler' {
    interface Howl {
        _autoplay: boolean
        suspend?: boolean
    }
    interface HowlerGlobal {
        _howls: Howl[]
    }
}

const { Howler: HowlerGlobal, Howl: HowlerConstructor } = HowlerInstance()
const { Howler: BGMGlobal, Howl: BGMConstructor } = HowlerInstance()
const { Howler: SEGlobal, Howl: SEConstructor } = HowlerInstance()
const { Howler: ClipGlobal, Howl: ClipConstructor } = HowlerInstance()
const { Howler: UISEGlobal, Howl: UISEConstructor } = HowlerInstance()

const globals = [HowlerGlobal, BGMGlobal, SEGlobal, ClipGlobal, UISEGlobal]

document.addEventListener('visibilitychange', () => {
    const howls = globals.flatMap((g) => g._howls)
    for (const howl of howls) {
        if (document.hidden) {
            const isLoadingAutoplay = howl.state() === 'loading' && howl._autoplay
            if (howl.playing() || isLoadingAutoplay) {
                howl.suspend = true
                howl.pause()
            }
        } else if (howl.suspend) {
            howl.play()
            howl.suspend = undefined
        }
    }
})

onStoreReady.then(({ config: { globalvolume, bgmvolume, sevolume, clipvolume, uisevolume } }) => {
    createEffect(() => HowlerGlobal.volume(globalvolume()))
    createEffect(() => BGMGlobal.volume(globalvolume() * bgmvolume()))
    createEffect(() => SEGlobal.volume(globalvolume() * sevolume()))
    createEffect(() => ClipGlobal.volume(globalvolume() * clipvolume()))
    createEffect(() => UISEGlobal.volume(globalvolume() * uisevolume()))
})

export { HowlerConstructor as Howler, BGMConstructor as BGM, SEConstructor as SE, ClipConstructor as Clip, UISEConstructor as UISE }
