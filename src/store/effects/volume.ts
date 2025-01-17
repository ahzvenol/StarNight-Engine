import { createEffect } from 'solid-js'
import { BGMGlobal, ClipGlobal, SEGlobal, UISEGlobal } from '../audio'
import { storePromise } from '../store'

export const effect = async () => {
    const store = await storePromise
    const { golbalvolume: Golbal, bgmvolume: BGM, sevolume: SE, clipvolume: Clip, uisevolume: UISE } = store.config
    createEffect(() => BGMGlobal.volume(Golbal() * BGM()))
    createEffect(() => SEGlobal.volume(Golbal() * SE()))
    createEffect(() => ClipGlobal.volume(Golbal() * Clip()))
    createEffect(() => UISEGlobal.volume(Golbal() * UISE()))
}
