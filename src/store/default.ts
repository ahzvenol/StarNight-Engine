import type { Reactive } from 'micro-reactive'
import type { InitialGameData } from '@/core/types/Game'
import type { language } from '@/store/effects/translations'
import { isMobile } from '@/utils/checkEnv'

// 确保程序运行所需的键值,如新增依赖变量,需要在这里添加默认值
const systemDefaultStore = {
    system: {
        name: 'StarNight Engine',
        key: 'StarNight Engine',
        versioncode: 1,
        versionname: '3.0',
        releasedate: '2025.2'
    },
    config: {
        fullscreen: isMobile() ? true : false,
        interruptclip: true,
        fastforwardunread: true,
        stopfastonselection: true,
        globalvolume: 1,
        bgmvolume: 0.5,
        sevolume: 0.7,
        clipvolume: 0.7,
        uisevolume: 1,
        textspeed: 0.5,
        autoreadspeed: 0.5,
        textboxopacity: 0.3,
        language: 'zh-CN' as keyof typeof language
    },
    save: {
        global: {
            unlock: Array<string>(),
            readsegment: Array<[number, number]>(),
            achievement: {} as Record<number, number>
        },
        local: {} as Record<number, LocalSaveData> & { [-1]: InitialGameData }
    }
}

export default systemDefaultStore

export type IniKV = Record<string, string | number | boolean>

export type Store = typeof systemDefaultStore
export type ReactiveStore = Reactive<Store>

export type GlobalSaveData = Store['save']['global']

export type LocalSaveData = {
    index: number
    select: Array<number | string>
    date: number
    text: string
    snapshot: string
}
