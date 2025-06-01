import { $async, $await } from '@/core/scripts'
import { $执行, $等待 } from '@/core/scripts/alias'
import { onStoreReady } from '@/store'
import { log } from '@/utils/Logger'
import type { GameScenario } from '@starnight/core'
import { AssetLoader, StarNight } from '@starnight/core'

// 挂载命令到window,简化添加import的编译器流程
window.$await = $await

window.$async = $async

window.$执行 = $执行

window.$等待 = $等待

// 挂载store到window,简化添加import的编译器流程
onStoreReady.then((store) => window.$store = store())

// 挂载空函数到window,避免is not a function异常
window.$call = () => {}

const scenarios = import.meta.glob('scenario/**/*.scenario.{js,ts,jsx,tsx}', { eager: true })

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
