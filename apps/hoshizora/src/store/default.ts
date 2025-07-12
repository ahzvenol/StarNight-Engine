import type { GameConfig, GameGlobalData, GameLocalData } from '@starnight/core'
import type { Reactive } from 'micro-reactive-solid'
import type { SimplifyDeep } from 'type-fest'
import { cloneDeep } from 'es-toolkit'
import { isDevelopment, isMobile, isNative } from '@/utils/checkEnv'
import { randomUUID } from '@/utils/randomUUID'

export interface ExtraConfig {
    fullscreen: boolean
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

const version = 32

const system = {
    name: '星空列车与白的旅行',
    key: 'Hoshizora',
    versioncode: version,
    versionname: 'next',
    releasedate: '2025.7'
}

const config: Config = {
    fullscreen: isMobile() ? true : false,
    textboxopacity: 0.3,
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

const local: Record<number, SaveLocalData> & { [-1]?: GameLocalData } = {}

const extra = {
    uid: randomUUID(),
    latestversion: version,
    firstentry: true,
    achievement: 0,
    announcement: `本移植版由白羽夜星制作组制作

在游玩前，您需确认：
1.您已<a href="https://store.steampowered.com/app/1567800/" target="_blank">购买</a>正版「星空列车与白的旅行」
2.本软件仅供学习交流，应在48小时之内删除
3.禁止将本软件或软件截屏录屏等上传至公开平台
4.禁止以任何有条件的形式分发本软件

QQ交流群：<a href="https://cusky.tk/group/hoshizora" target="_blank">816486177</a>
软件下载/更新链接：<a href="https://cusky.tk/download/hoshizora" target="_blank">cusky.tk/download/hoshizora</a>`
}

export const SystemDefaultStore = () => cloneDeep({ system, config, global, local, extra } as const)

export type Store = SimplifyDeep<ReturnType<typeof SystemDefaultStore>>
export type ReactiveStore = Reactive<Store>
