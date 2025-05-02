import type { RuntimeCommandLike } from '@starnight/core'
import { StarNight } from '@starnight/core'
import { isPlainObject, isString, range } from 'es-toolkit'
import { AssetLoader } from '@/utils/AssetLoader'
import { log } from '@/utils/Logger'

// 预加载游戏初始坐标后N幕资源
StarNight.ActEvents.ready.subscribe(({ current: { index }, instance: { book } }) => {
    range(index(), index() + 5).forEach(() => {
        if (index() < book.length()) {
            const rows = book.act(index())
            loadByNamingConvention(rows)
        }
    })
})
// 预加载跳转目标后N幕资源
StarNight.ActEvents.jump.subscribe(({ instance: { state }, current: { index }, instance: { book } }) => {
    range(index(), index() + 5).forEach(() => {
        if (!state.isInitializing() && index() < book.length()) {
            const rows = book.act(index())
            loadByNamingConvention(rows)
        }
    })
})
// 预加载本幕后第N幕的资源
StarNight.ActEvents.start.subscribe(({ instance: { state }, current: { index }, instance: { book } }) => {
    if (!state.isInitializing() && index() < book.length()) {
        const rows = book.act(index())
        loadByNamingConvention(rows)
    }
})

// 基于命名约定的预加载,搜索所有名称为src的参数
function loadByNamingConvention(rows: Array<RuntimeCommandLike>) {
    rows.forEach((row) => {
        if (Array.isArray(row.args)) {
            loadByNamingConvention(row.args)
        } else if (isPlainObject(row.args)) {
            Object.entries(row.args)
                .filter(([key]) => key === 'src')
                .map((kv) => kv[1])
                .filter((value) => isString(value))
                .forEach((url) => {
                    if (AssetLoader.loaded.has(url)) log.info(`资源'${url}'已预加载过`)
                    else {
                        AssetLoader.load(url)
                            .then(() => log.info(`预加载资源'${url}'成功`))
                            .catch((err) => log.info(`预加载资源'${url}'失败:${err}`))
                    }
                })
        }
    })
}
