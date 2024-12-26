import type { Reactive, ReactiveType } from 'micro-reactive'
import type { Accessor } from 'solid-js'
import { toMerged } from 'es-toolkit'
import { useReactive } from 'micro-reactive'
import { createEffect, on } from 'solid-js'
import { storePromise } from '@/store/store'
import { log } from '@/utils/logger'
import { ChineseSimplified } from './ChineseSimplified'
import { English } from './English'
import { Japanese } from './Japanese'

export const language = {
    'zh-CN': ChineseSimplified,
    en: English,
    jp: Japanese
}

// 因为需要合并选择的语言和默认语言的翻译,所以对语言名称的描述不能写在翻译里
export const description = {
    'zh-CN': '中文',
    en: 'English',
    jp: '日本語'
}

// 可选as Reactive<typeof language[keyof typeof language]>,这时类型系统可以检测出翻译的缺失并要求全部可选语言都具备对应值的翻译
// 目前采用的策略是以默认语言为最大集合,合并选择的语言和默认语言的翻译,通过默认语言补全翻译缺失的值
export const translation = useReactive({}) as Reactive<(typeof language)['zh-CN']>

// 通过在修改lang前判断lang是否真正修改减少视图渲染,同时需要贯彻"只在使用响应式变量的地方调用它"的原则
// 否则,无论是计算属性,还是间接赋值,每次修改lang都会使整个子组件树更新
storePromise.then((store) => {
    const lang = store.config.language
    const defaultLang = lang() as 'zh-CN'
    // tag:最新版本好像这里判不判断都没啥动静了,都不会重复渲染
    createEffect(
        on(lang as Accessor<ReactiveType<typeof lang>>, (now, prev) => {
            if (now !== prev) {
                translation(toMerged(language[defaultLang], language[lang()]))
                log.info('当前语言:' + description[lang()])
            }
        })
    )
})
