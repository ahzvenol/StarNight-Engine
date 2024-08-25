import logger from "@/utils/Logger"
import { Reactive, useReactive, watch } from "micro-reactive"
import { createEffect } from "solid-js"
import { ChineseSimplified } from "./ChineseSimplified"
import { English } from "./English"
import { Japanese } from "./Japanese"
import { storePromise } from "@/store"

export const language = {
    "zh-CN": ChineseSimplified,
    "en": English,
    "jp": Japanese
}

// export const lang = useReactive("zh-CN") as Reactive<keyof typeof language>



// 通过在修改lang前判断lang是否真正修改减少视图渲染,同时需要贯彻"只在使用响应式变量的地方调用它"的原则
// 否则,无论是计算属性,还是间接赋值,每次修改lang都会触发组件更新
// export const translation = useComputed(() => language[lang()])

export const translation = useReactive({}) as Reactive<typeof language[keyof typeof language]>

// watch((now, old) => { }, [lang])

storePromise.then((store) => {
    const lang = store.config.language
    translation(language[lang()])
    watch((now, old) => {
        if (now[0] !== old[0]) {
            translation(language[lang()])
            logger.info("当前语言:" + language[lang()].description)
        }
    }, [lang])
})