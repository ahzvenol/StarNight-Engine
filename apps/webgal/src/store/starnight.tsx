import type { GameConstructorParams, StarNightInstance } from '@starnight/core'
import { StarNight } from '@starnight/core'
import { useReactive, useSignal } from 'micro-reactive-solid'
import { ScenarioDSL } from '@/core/ScenarioDSL'
import { BGM, SE, Clip } from './audio'
import { onStoreReady } from '.'

StarNight.useReactive = useReactive

export const starnight = useSignal<StarNightInstance>(null as unknown as StarNightInstance)

export const ui = () => starnight().context.ui

export const entry = import('./scenario').then((mod) => mod.entry)

export const debug = import('./scenario').then((mod) => mod.debug)

export const script = async () => ScenarioDSL(await entry, await debug)

export const instance = async (local: GameConstructorParams['local']) => {
    const store = await onStoreReady
    return StarNight.instance({
        script: await script(),
        config: store.config,
        local: local,
        global: store.global,
        ui: {
            audiotracks: {
                bgm: BGM,
                se: SE,
                clip: Clip
            }
        }
    })
}
