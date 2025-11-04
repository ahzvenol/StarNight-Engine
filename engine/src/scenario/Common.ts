import type { GameRuntimeContext } from '@starnight/core'
import type { Store } from '@/store/default'
import { createEffect } from 'solid-js'
import { noop } from 'es-toolkit'
import { onStoreReady } from '@/store'
import { MergedCommands } from '@/scripts'

export const $debugger = Symbol()

const $character = (name: string) => (text: string, clip?: string) => MergedCommands.Say.apply({ text, name, clip })

// 挂载关键变量和函数到window
Object.assign(window, { $character, $debugger, $include: noop })

// 挂载store到window,拆箱store以省略Singal概念
onStoreReady.then((store) =>
    createEffect(() => Object.assign(window, { $store: store() }))
)

/**
 * 在剧本中使用这个变量创建对话。
 * @example
 * const noi = $character("诺瓦")
 * noi`……我将踏上一段愉快的旅程。`
 */
type $say = (strings: TemplateStringsArray, ...values: unknown[]) => void

// 定义ts全局类型
declare global {

    /**
     * 在剧本中使用 `$store` 访问包括设置，存档在内的全部游戏数据。
     * @remarks
     * - 不要在剧本之外使用这个变量。
     */
    const $store: Store

    /**
     * 在剧本中使用 `$context` 访问游戏实例当前的运行时数据。
     * @remarks
     * - 不要在剧本之外使用这个变量。
     */
    const $context: GameRuntimeContext

    /**
     * 在剧本中使用 `$action` 手动划分幕
     */
    const $action: unknown

    /**
     * 在剧本中使用 `$debugger` 让剧情从指定位置开始。
     */
    const $debugger: unique symbol

    /**
     * 在剧本中使用 `$include` 将指定剧本的内容嵌入。
     * @example
     * $include('./example.scenario.tsx')
     */
    const $include: (arg0: string) => void

    /**
     * 在剧本中使用 `$character` 创建角色。
     * @example
     * const noi = $character("诺瓦")
     */
    const $character: (arg0: string) => $say

}
