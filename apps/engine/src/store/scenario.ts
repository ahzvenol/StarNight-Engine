import type { GameRuntimeContext } from '@starnight/core'
import type { GameScenarioDSL } from '@/scripts/ScenarioDSL'
import type { Store } from './default'
import { AssetLoader, StarNight } from '@starnight/core'
import { createEffect } from 'solid-js'
import { noop } from 'es-toolkit'
import { $debugger } from '@/scripts/ScenarioDSL'
import { onStoreReady } from '@/store'
import { log } from '@/utils/Logger'
import { MergedCommands } from '@/scripts'

// 使用中文命令
import '@/scripts/translations/ChineseSimplified'

type GameCompiledScenarioDSL = GameScenarioDSL & { assetmap: string[][] } & { debug?: true }

// 匹配剧本文件,让它们打包到一起
const scenarios = import.meta.glob(
    'scenario/**/*.scenario.{mjs,js,mts,ts,jsx,tsx}', { eager: true }
) as Partial<Record<string, { default: GameCompiledScenarioDSL }>>

// 剧本入口,默认为index.scenario
export const entry = ['mjs', 'js', 'mts', 'ts', 'jsx', 'tsx'].reduce<GameCompiledScenarioDSL>(
    (acc, ext) => acc || scenarios[`/scenario/index.scenario.${ext}`]?.default, null as unknown as GameCompiledScenarioDSL
)

export const debug = Object.values(scenarios).map((scenario) => scenario?.default.debug).some(Boolean)

// 挂载store到window,拆箱store以省略Singal概念
// 挂载命令到window,让剧本文件可以直接使用而无需import
// 挂载空函数到window,避免错误使用时导致is not a function异常
onStoreReady.then((store) =>
    createEffect(() => Object.assign(window, { $store: store() }))
)
Object.assign(window, { $say: MergedCommands.Say.apply, $debugger, $include: noop })

function load(url: string) {
    url = './static' + url
    if (AssetLoader.loaded.has(url)) log.info(`资源'${url}'已预加载过`)
    else {
        AssetLoader.load(url)
            .then(() => log.info(`预加载资源'${url}'成功`))
            .catch((err) => log.info(`预加载资源'${url}'失败:${err}`))
    }
}

// 资源预加载
entry.assetmap.slice(0, 1 + 1).flat().forEach(load)
StarNight.ActEvents.start.subscribe(({ state, current: { index, sence } }) => {
    if (state.isInitializing()) return
    const scenario = scenarios[`/${sence()}`]
    scenario!.default.assetmap.slice(index(), index() + 5).flat().forEach(load)
})

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
    const $action: symbol

    /**
     * 在剧本中使用 `$debugger` 让剧情从指定位置开始。
     */
    const $debugger: symbol

    /**
     * 在剧本中使用 `$include` 将指定剧本的内容嵌入。
     * @example
     * $include('./example.scenario.tsx')
     */
    const $include: (arg0: string) => void

}
