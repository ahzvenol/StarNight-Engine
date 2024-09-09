import { storePromise } from "@/store"
import logger from "@/utils/Logger"
import { toMerged } from "es-toolkit"
import { Reactive, useReactive, watch } from "micro-reactive"
import { ChineseSimplified } from "./ChineseSimplified"
import { English } from "./English"
import { Japanese } from "./Japanese"

export const language = {
    "zh-CN": ChineseSimplified,
    "en": English,
    "jp": Japanese
}

export const description = {
    "zh-CN": '中文',
    "en": 'English',
    "jp": '日本語'
}

// 其他语言的翻译有可能出现缺失,这时候类型系统会发出提示
// issue:但是实际运行的话,可能需要用中文对应的键先充当补全
// export const translation = useReactive({}) as Reactive<typeof language[keyof typeof language]>
export const translation = useReactive({}) as Reactive<typeof language["zh-CN"]>

// 通过在修改lang前判断lang是否真正修改减少视图渲染,同时需要贯彻"只在使用响应式变量的地方调用它"的原则
// 否则,无论是计算属性,还是间接赋值,每次修改lang都会使整个子组件树更新
storePromise.then((store) => {
    // todo:这块有点乱了,需要再行考虑
    // fix:目前使用的language.description如果合并会出事,怪不得隔壁不用
    const lang = store.config.language
    const defaultLang = "zh-CN"
    translation(toMerged(language[defaultLang], language[lang()]))
    // tag:最新版本好像这里判不判断都没啥动静了,都不会重复渲染
    // watch((now, old) => {
    //     // if (now[0] !== old[0]) {
    //         translation(language[lang()])
    //         logger.info("当前语言:" + language[lang()].description)
    //     // }
    // }, [lang])
    watch(() => {
        translation(toMerged(language[defaultLang], language[lang()]))
        logger.info("当前语言:" + description[lang()])
    })
})