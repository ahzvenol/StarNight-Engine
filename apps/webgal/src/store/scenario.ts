import type { GameScenario } from '@starnight/core'
import { AssetLoader, StarNight } from '@starnight/core'
import { $async, $await } from '@/core/scripts'
import { $执行, $等待 } from '@/core/scripts/alias'
import { onStoreReady } from '@/store'
import { log } from '@/utils/Logger'

// 剧本入口,默认为index.scenario
// @ts-expect-error 文件不是模块。
export { default } from 'scenario/index.scenario'

// 挂载命令到window,让剧本文件可以直接使用而无需import
// 挂载空函数到window,避免错误使用时is not a function异常
Object.assign(window, { $await, $async, $执行, $等待, $call: () => {} })

// 挂载store到window,让剧本文件可以直接使用而无需import
onStoreReady.then((store) => window.$store = store())

// glob剧本文件,让它们打包到一起
const scenarios = import.meta.glob('scenario/**/*.scenario.{js,ts,jsx,tsx}', { eager: true })

// 订阅游戏事件,进行资源预加载
StarNight.ActEvents.start.subscribe(({ state, current: { index, sence } }) => {
    if (state.isInitializing()) return
    const scenario = scenarios[`/${sence()}`] as { default: GameScenario<number> & { assetmap: string[][] } }
    scenario.default.assetmap
        .slice(index(), index() + 5).flat()
        .forEach((url) => {
            url = './static' + url
            if (AssetLoader.loaded.has(url)) log.info(`资源'${url}'已预加载过`)
            else {
                AssetLoader.load(url)
                    .then(() => log.info(`预加载资源'${url}'成功`))
                    .catch((err) => log.info(`预加载资源'${url}'失败:${err}`))
            }
        })
})
