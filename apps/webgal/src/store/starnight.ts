import type { GameBookRaw, StarNightInstance } from 'starnight'
import * as msgpack from '@msgpack/msgpack'
import dayjs from 'dayjs'
import { useReactive, useSignal } from 'micro-reactive-solid'
import { createEffect, on, onCleanup } from 'solid-js'
import { Converter, GameBook, GameState, StarNight } from 'starnight'
import { commands } from '@/core/commands'
import { macros } from '@/core/macros'
import { router } from '@/router'
import { gameRef } from '@/ui/Webgal/Game/Game'
import { Pages } from '@/ui/Webgal/Pages'
import { resource } from '@/utils/request'
import { useEventListener } from '@/utils/solid/useEventListener'
import { onStoreReady } from '.'

// 在进入游戏外页面时调用以暂停自动和快进,在离开此页面时恢复
export const smartAutoAndFast = () => {
    if (starnight().state() === GameState.Auto) {
        starnight().ClickEvents.auto.publish()
        onCleanup(() => {
            starnight().ClickEvents.auto.publish()
        })
    } else if (starnight().state() === GameState.Fast) {
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
    if (state !== GameState.Init && state !== GameState.Fast) {
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
