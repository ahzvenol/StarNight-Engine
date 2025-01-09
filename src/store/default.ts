import type { Reactive } from 'micro-reactive'
import type { CommandArg } from '@/core/types/Command'
import type { language } from '@/store/effects/translations'

// 确保程序运行所需的键值,如新增依赖变量,需要在这里添加默认值
const systemDefaultStore = {
    system: {
        name: 'StarNight Engine',
        key: 'StarNight Engine',
        version: '0.0.1'
    },
    config: {
        fullscreen: false,
        interruptclip: true,
        fastforwardunread: false,
        stopfastonselection: true,
        golbalvolume: 1,
        bgmvolume: 1,
        sevolume: 1,
        clipvolume: 1,
        uisevolume: 1,
        textspeed: 1,
        autoreadspeed: 1,
        textboxopacity: 1,
        language: 'zh-CN' as keyof typeof language
    },
    save: {
        global: { cg: Array<string>(), segment: Array<[number, number]>() },
        local: {} as Record<number, LocalSaveData>
    },
    user: {}
}

export default systemDefaultStore

export type IniKV = Record<string, string | number | boolean>

export type Store = typeof systemDefaultStore
export type ReactiveStore = Reactive<Store>

export type GlobalSaveData = Record<string, unknown> & Store['save']['global']
export type LocalSaveData = Record<string, CommandArg> & { index: number; date: number; preview: string; text: string }
