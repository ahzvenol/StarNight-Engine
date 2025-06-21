import type { GameConstructorParams, StarNightInstance } from '@starnight/core'
import { StarNight } from '@starnight/core'
import { useReactive, useSignal } from 'micro-reactive-solid'
import { ScenarioDSL } from '@/scripts/ScenarioDSL'
import { useGame } from '@/ui/GameRoot'
import { BGM, SE, Clip } from './audio'
import { onStoreReady } from '.'

StarNight.useReactive = useReactive

export const starnight = useSignal<StarNightInstance>(null as unknown as StarNightInstance)

export const ui = () => starnight().context.ui

export const entry = import('./scenario').then((mod) => mod.entry)

export const debug = import('./scenario').then((mod) => mod.debug)

export const script = async () => ScenarioDSL(await entry, await debug)

export const instance = async (local: GameConstructorParams['local']) => {
    const { config, global } = await onStoreReady
    return StarNight.instance({
        script: await script(), config, local, global,
        ui: {
            view: <canvas width={1280} height={720} /> as HTMLCanvasElement,
            audio: { bgm: BGM, se: SE, clip: Clip }
        }
    })
}

// 如果处在调试模式,直接进入游戏页
debug.then((isDebug) => {
    if (isDebug) {
        useGame({ count: 1 })
    }
})
