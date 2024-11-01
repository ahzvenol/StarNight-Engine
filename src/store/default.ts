import type { Reactive } from 'micro-reactive'
import type { CommandArg } from '@/core/type'
import type { language } from '@/store/effect/translations'

// 确保程序运行所需的键值,如新增依赖变量,需要在这里添加默认值
const systemDefaultStore = {
    system: {
        name: 'default',
        version: '1',
        width: 2560,
        height: 1440,
        mode: 'auto' as 'auto' | 'full'
    },
    config: {
        FullScreen: false,
        InterruptClip: true,
        FastForwardUnread: false,
        StopFastOnSelection: true,
        GolbalVolume: 1,
        BGMVolume: 1,
        SEVolume: 1,
        ClipVolume: 1,
        UISEVolume: 1,
        TextSpeed: 1,
        AutoReadSpeed: 1,
        TextBoxOpacity: 1,
        Language: 'zh-CN' as keyof typeof language
    },
    save: {
        global: { cg: Array<string>(), segment: '[]' },
        local: {} as Record<number, LocalSaveData>
    },
    user: {}
}

export default systemDefaultStore

export type IniKV = Record<string, string | number | boolean>

// & IniKV会丢失类型检查,所以不在类型上书写它
export type Store = typeof systemDefaultStore
export type ReactiveStore = Reactive<Store>

export type GlobalSaveData = Record<string, unknown> & Store['save']['global']
export type LocalSaveData = Record<string, CommandArg> & { row: number; date: number; preview: string; text: string }
