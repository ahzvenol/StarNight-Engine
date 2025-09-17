import type { GameScenarioDSL } from '@/scenario/ScenarioDSL'
import { AssetLoader, StarNight } from '@starnight/core'
import { log } from '@/utils/Logger'

// 使用中文命令
import '@/scenario/Common'
import '@/scenario/ChineseSimplified'

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
