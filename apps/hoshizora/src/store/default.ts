import type { Reactive } from 'micro-reactive-solid'
import type { GameConfig, GameGlobalData, GameLocalData } from '@/core/types/Game'
import { isMobile } from '@/utils/checkEnv'
import { randomUUID } from '@/utils/randomUUID'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ExtraConfig {
    fullscreen: boolean
    textboxopacity: number
    readtextcolor: string
    unreadtextcolor: string
    language: string
}

export type Config = ExtraConfig & GameConfig

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ExtraGlobalSaveData {}

export type SaveGlobalData = ExtraGlobalSaveData & GameGlobalData

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ExtraLocalSaveData {
    date: number
    snapshot: string
}

export type SaveLocalData = ExtraLocalSaveData & GameLocalData

const version = 1

const system = {
    name: '巧克甜恋',
    key: 'Amachoco',
    versioncode: version,
    versionname: '1.0',
    releasedate: '2025.2'
}

const config: Config = {
    fullscreen: isMobile() ? true : false,
    textboxopacity: 0.85,
    readtextcolor: '#FEFB8F',
    unreadtextcolor: '#FEFEFE',
    language: 'zh-CN',
    interruptclip: true,
    fastforwardunread: true,
    stopfastonselection: true,
    stopautoonselection: true,
    globalvolume: 0.85,
    bgmvolume: 0.65,
    sevolume: 0.75,
    clipvolume: 0.85,
    uisevolume: 0.3,
    textspeed: 0.5,
    autoreadspeed: 0.8,
    backlogmaxlength: 50
}

const global: SaveGlobalData = { unlock: [], readsegment: [], achievement: {} }

const local = {} as Record<number, SaveLocalData> & { [-1]: GameLocalData | undefined }

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

export const SystemDefaultStore = () => ({ system, config, global, local, extra }) as const

export type Store = ReturnType<typeof SystemDefaultStore>
export type ReactiveStore = Reactive<Store>
