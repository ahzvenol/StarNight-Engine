import type { GameConfig, GameGlobalData, GameLocalData } from '@starnight/core'
import type { Reactive } from 'micro-reactive-solid'
import type { SimplifyDeep } from 'type-fest'
import { cloneDeep } from 'es-toolkit'
import { isDevelopment, isMobile, isNative } from '@/utils/checkEnv'

export interface ExtraConfig {
    fullscreen: boolean
    textboxfont: '思源宋体' | 'LXGW' | 'WebgalUI'
    textboxfontsize: '155%' | '205%' | '230%'
    textboxopacity: number
    language: string | null
    globalvolume: number
    bgmvolume: number
    sevolume: number
    clipvolume: number
    uisevolume: number
}

export type Config = ExtraConfig & GameConfig

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ExtraGlobalSaveData {}

export type SaveGlobalData = ExtraGlobalSaveData & GameGlobalData

export interface ExtraLocalSaveData {
    date: number
    snapshot: string
}

export type SaveLocalData = ExtraLocalSaveData & GameLocalData

const version = 1

const system = {
    name: 'StarNight Engine',
    key: 'StarNight',
    versioncode: version,
    versionname: 'next',
    releasedate: '2025.x'
}

const config: Config = {
    fullscreen: isMobile() ? true : false,
    textboxfont: 'WebgalUI',
    textboxfontsize: '155%',
    textboxopacity: 0.75,
    language: 'zh-CN',
    interruptclip: true,
    fastforwardunread: true,
    stopfastonchoice: true,
    stopautoonchoice: true,
    globalvolume: 1,
    bgmvolume: 0.5,
    sevolume: 0.7,
    clipvolume: 0.7,
    uisevolume: 1,
    textspeed: 50,
    autoreadspeed: 1000,
    fastreadspeed: isNative() || isDevelopment() ? 10 : 100,
    backlogmaxlength: 50
}

const global: SaveGlobalData = { unlocked: [], readsegment: {}, achievement: {} }

const local: Record<number, SaveLocalData> & { [0]?: GameLocalData } & { [-1]?: GameLocalData } = {}

const extra = {}

export const SystemDefaultStore = () => cloneDeep({ system, config, global, local, extra } as const)

export type Store = SimplifyDeep<ReturnType<typeof SystemDefaultStore>>
export type ReactiveStore = Reactive<Store>
