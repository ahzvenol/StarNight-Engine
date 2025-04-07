import type { Howl, HowlConstructor, HowlOptions } from '@/lib/howler'
import { createEffect } from 'solid-js'
import { HowlerInstance } from '@/lib/howler'
import { onStoreReady } from '@/store'
import { useSignal } from 'micro-reactive-solid'

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

export const AudioMutex = useSignal('')
