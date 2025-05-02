import type { Reactive } from '@starnight/core'
import { toMerged } from 'es-toolkit'
import { useReactive } from 'micro-reactive-solid'
import { createEffect, on } from 'solid-js'
import { onStoreReady } from '@/store'
import { log } from '@/utils/Logger'
import { ChineseSimplified } from './ChineseSimplified'
import { ChineseTraditional } from './ChineseTraditional'
import { English } from './English'
import { French } from './French'
import { German } from './German'
import { Japanese } from './Japanese'

export const language = {
    'zh-CN': ChineseSimplified,
    'zh-TW': ChineseTraditional,
    en: English,
    ja: Japanese,
    fr: French,
    de: German
}

export const description = {
    'zh-CN': '简体中文',
    en: 'English',
    ja: '日本語',
    fr: 'Français',
    de: 'Deutsch',
    'zh-TW': '繁體中文'
} satisfies Record<keyof typeof language, string>

// 可选as Reactive<typeof language[keyof typeof language]>,这时类型系统可以检测出翻译的缺失并要求全部可选语言都具备对应值的翻译
// 目前采用的策略是以默认语言为最大集合,合并选择的语言和默认语言的翻译,通过默认语言补全翻译缺失的值
export const translation = useReactive({}) as Reactive<(typeof language)['zh-CN']>

onStoreReady.then((store) => {
    const lang = store.config.language as Reactive<keyof typeof language>
    const defaultLang = lang() as 'zh-CN'
    createEffect(
        on(lang, (now, prev) => {
            if (now !== prev) {
                translation(toMerged(language[defaultLang], language[now]))
                log.info('当前语言:' + description[now])
            }
        })
    )
})
