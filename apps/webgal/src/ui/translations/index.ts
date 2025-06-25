import type { Reactive } from 'micro-reactive-solid'
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

type Translations = typeof translations

export const translations = {
    'zh-CN': ChineseSimplified,
    'zh-TW': ChineseTraditional,
    en: English,
    ja: Japanese,
    fr: French,
    de: German
}

// 在对应语言中的语言名称
export const descriptions = {
    'zh-CN': '简体中文',
    en: 'English',
    ja: '日本語',
    fr: 'Français',
    de: 'Deutsch',
    'zh-TW': '繁體中文'
} satisfies Record<keyof Translations, string>

// 可选as Reactive<typeof language[keyof typeof language]>,这时类型系统可以检测出翻译的缺失并要求全部可选语言都具备对应值的翻译
// 目前采用的策略是以默认语言为最大集合,合并选择的语言和默认语言的翻译,通过默认语言补全翻译缺失的值
export const translation = useReactive({}) as Reactive<Translations['zh-CN']>

onStoreReady.then((store) => {
    const lang = store.config.language as Reactive<keyof Translations>
    // 如果没有设置默认语言,根据用户语言自动选择合适的翻译,如果不存在该翻译,回退到简体中文
    if (lang() === null) {
        lang((Object.keys(translations).find((lang) => navigator.language.startsWith(lang)) as keyof Translations) || 'zh-CN')
    }
    // 根据当前语言设置更新translation和document.documentElement.lang
    createEffect(
        on(lang, (now, prev) => {
            if (now !== prev) {
                document.documentElement.lang = now
                translation(toMerged(translations['zh-CN'], translations[now]))
                log.info('当前语言:' + descriptions[now])
            }
        })
    )
})
