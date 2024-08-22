import { Reactive, useReactive, useComputed } from "micro-reactive"
import { ChineseSimplified } from "./ChineseSimplified"
import { createEffect, createMemo } from "solid-js"
import logger from "@/utils/Logger"
import { Japanese } from "./Japanese"

export const language = {
    "zh-CN": ChineseSimplified,
    "jp": Japanese
}

export const lang = useReactive("zh-CN") as Reactive<keyof typeof language>

createEffect(() => logger.info("当前语言:" + lang()))

export const translation = useComputed(() => language[lang()])