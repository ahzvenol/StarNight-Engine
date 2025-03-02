import { createEffect } from 'solid-js'
import { onStoreReady } from '..'
import { BGMGlobal, ClipGlobal, HowlerGlobal, SEGlobal, UISEGlobal } from '../../core/commands/script/abstract/audio'

onStoreReady.then(({ config }) => {
    const { globalvolume: Global, bgmvolume: BGM, sevolume: SE, clipvolume: Clip, uisevolume: UISE } = config
    createEffect(() => HowlerGlobal.volume(Global()))
    createEffect(() => BGMGlobal.volume(Global() * BGM()))
    createEffect(() => SEGlobal.volume(Global() * SE()))
    createEffect(() => ClipGlobal.volume(Global() * Clip()))
    createEffect(() => UISEGlobal.volume(Global() * UISE()))
})
