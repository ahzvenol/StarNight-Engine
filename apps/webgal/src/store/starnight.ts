import type { GameBookRaw, RuntimeCommandLike, StarNightInstance } from 'starnight'
import * as msgpack from '@msgpack/msgpack'
import dayjs from 'dayjs'
import { isPlainObject, isString, range } from 'es-toolkit'
import { useReactive, useSignal } from 'micro-reactive-solid'
import { createEffect, on, onCleanup } from 'solid-js'
import { Converter, GameBook, StarNight } from 'starnight'
import { commands } from '@/core/commands'
import { macros } from '@/core/macros'
import { router } from '@/router'
import { gameRef } from '@/ui/Webgal/Game/Game'
import { Pages } from '@/ui/Webgal/Pages'
import { Loader } from '@/utils/Loader'
import { log } from '@/utils/Logger'
import { resource } from '@/utils/request'
import { useEventListener } from '@/utils/solid/useEventListener'
import { onStoreReady } from '.'

// 在进入游戏外页面时调用以暂停自动和快进,在离开此页面时恢复
export const smartAutoAndFast = () => {
    if (starnight().state.isAuto()) {
        starnight().ClickEvents.auto.publish()
        onCleanup(() => {
            starnight().ClickEvents.auto.publish()
        })
    } else if (starnight().state.isFast()) {
        starnight().ClickEvents.fast.publish()
        onCleanup(() => {
            starnight().ClickEvents.auto.publish()
        })
    }
}

createEffect(
    on(
        router.active,
        (now, prev) => {
            // 返回标题页时暂停游戏,回到标题页时恢复
            if (now === Pages.Title) {
                starnight()?.suspend()
            } else if (now === Pages.Game) {
                starnight()?.resume()
                // 在游戏页面离开标签页时暂停游戏,回到标签页时恢复
                useEventListener('visibilitychange', function () {
                    if (document.visibilityState === 'hidden') {
                        starnight()?.suspend()
                    } else if (document.visibilityState === 'visible') {
                        starnight()?.resume()
                    }
                })
            } else if (prev === Pages.Game) {
                smartAutoAndFast()
            }
        },
        { defer: true }
    )
)

// 自动存档
StarNight.ActEvents.end.subscribe(async ({ state, current }) => {
    const store = await onStoreReady
    if (!state.isAuto() && !state.isFast()) {
        store.local[0]({ ...current(), date: dayjs().valueOf(), snapshot: gameRef()!.outerHTML })
    }
})
// 结束游戏回到标题页
StarNight.GameEvents.end.subscribe(() => {
    router.navigate(Pages.Title)
})

Object.assign(StarNight.Commands, commands)

Array.prototype.push.call(StarNight.Marcos, ...macros)

StarNight.useReactive = useReactive

const raw = resource('./book.json', { responseType: 'arraybuffer' }).then(
    (res) => msgpack.decode(new Uint8Array(res.data)) as GameBookRaw
)

export const book = raw.then((raw) => GameBook.create(raw, new Converter(StarNight.Commands, StarNight.Marcos)))

export const starnight = useSignal<StarNightInstance>(null as unknown as StarNightInstance)
export const ui = () => starnight().context.ui

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
        if (!state.isInitializing && index() < book.length()) {
            const rows = book.act(index())
            loadByNamingConvention(rows)
        }
    })
})
// 预加载本幕后第N幕的资源
StarNight.ActEvents.start.subscribe(({ instance: { state }, current: { index }, instance: { book } }) => {
    if (!state.isInitializing && index() < book.length()) {
        const rows = book.act(index())
        loadByNamingConvention(rows)
    }
})

// 基于命名约定的预加载,搜索所有名称为file的参数
function loadByNamingConvention(rows: Array<RuntimeCommandLike>) {
    rows.forEach((row) => {
        if (Array.isArray(row.args)) {
            loadByNamingConvention(row.args)
        } else if (isPlainObject(row.args)) {
            Object.entries(row.args)
                .filter(([key]) => key === 'file')
                .map((kv) => kv[1])
                .filter((value) => isString(value))
                .forEach((url) => {
                    if (Loader.loaded.has(url)) log.info(`资源'${url}'已预加载过`)
                    else {
                        Loader.load(url)
                            .then(() => log.info(`预加载资源'${url}'成功`))
                            .catch((err) => log.info(`预加载资源'${url}'失败:${err}`))
                    }
                })
        }
    })
}
