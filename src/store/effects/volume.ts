import { createEffect } from 'solid-js'
import { BGMGlobal, ClipGlobal, SEGlobal, UISEGlobal } from '../audio'
import { storePromise } from '../store'

export const effect = async () => {
    const store = await storePromise
    const { globalvolume: Global, bgmvolume: BGM, sevolume: SE, clipvolume: Clip, uisevolume: UISE } = store.config
    createEffect(() => BGMGlobal.volume(Global() * BGM()))
    createEffect(() => SEGlobal.volume(Global() * SE()))
    createEffect(() => ClipGlobal.volume(Global() * Clip()))
    createEffect(() => UISEGlobal.volume(Global() * UISE()))
}
