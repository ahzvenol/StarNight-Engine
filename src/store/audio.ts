import type { Howl, Howlonstructor, HowlOptions } from './../lib/howler'
import { HowlerInstance } from './../lib/howler'

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
function wrapHowlWithSuspend(HowlClass: Howlonstructor) {
    return function (options: HowlOptions): Howl {
        const howlInstance = new HowlClass(options)
        suspendWhenDocumentHidden(howlInstance)
        return howlInstance
    }
}

const { Howler: BGMGlobal, Howl: BGMConstructor } = HowlerInstance()
const { Howler: SEGlobal, Howl: SEConstructor } = HowlerInstance()
const { Howler: ClipGlobal, Howl: ClipConstructor } = HowlerInstance()
const { Howler: UISEGlobal, Howl: UISEConstructor } = HowlerInstance()

export const BGM = wrapHowlWithSuspend(BGMConstructor)
export const SE = wrapHowlWithSuspend(SEConstructor)
export const Clip = wrapHowlWithSuspend(ClipConstructor)
export const UISE = wrapHowlWithSuspend(UISEConstructor)

export { BGMGlobal, SEGlobal, ClipGlobal, UISEGlobal }
