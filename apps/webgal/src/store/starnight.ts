import type { GameBookRaw, StarNightInstance } from 'starnight'
import * as msgpack from '@msgpack/msgpack'
import dayjs from 'dayjs'
import { range } from 'es-toolkit'
import { useReactive, useSignal } from 'micro-reactive-solid'
import { createEffect, on, onCleanup } from 'solid-js'
import { Converter, GameBook, GameState, StarNight } from 'starnight'
import { commands } from '@/core/commands'
import { macros } from '@/core/macros'
import { router } from '@/router'
import { gameRef } from '@/ui/Webgal/Game/Game'
import { Pages } from '@/ui/Webgal/Pages'
import { log } from '@/utils/logger'
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
            preloadByNamingConvention(rows)
        }
    })
})
// 预加载跳转目标后N幕资源
StarNight.ActEvents.jump.subscribe(({ state, current: { index }, instance: { book } }) => {
    range(index(), index() + 5).forEach(() => {
        if (state !== GameState.Init && index() < book.length()) {
            const rows = book.act(index())
            preloadByNamingConvention(rows)
        }
    })
})
// 预加载本幕后第N幕的资源
StarNight.ActEvents.start.subscribe(({ state, current: { index }, instance: { book } }) => {
    if (state !== GameState.Init && index() < book.length()) {
        const rows = book.act(index())
        preloadByNamingConvention(rows)
    }
})

StarNight.ActEvents.start.subscribe(async ({ current: { index }, instance: { book } }) => {})

const IMAGE_EXTENSIONS = ['apng', 'avif', 'gif', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp']

const AUDIO_EXTENSIONS = [
    'mp3',
    'mpeg',
    'opus',
    'ogg',
    'oga',
    'wav',
    'aac',
    'caf',
    'm4a',
    'm4b',
    'mp4',
    'weba',
    'webm',
    'dolby',
    'flac'
]

const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'mkv']

const loadedResources = new Set<string>()

export function preloadResource(url: string) {
    // 忽略已经加载过的资源
    if (loadedResources.has(url)) return
    // 忽略没有扩展名的url
    if (url.lastIndexOf('.') === -1) return

    const extension = url.split('.').pop()!.toLowerCase()

    if (IMAGE_EXTENSIONS.includes(extension)) {
        // 图片
        preloadImage(url)
    } else if (AUDIO_EXTENSIONS.includes(extension)) {
        // 音频
        preloadAudio(url)
    } else if (VIDEO_EXTENSIONS.includes(extension)) {
        // 视频
        preloadVideo(url)
    } else {
        log.warn(`未知文件类型:${extension}`)
    }

    // 记录该资源已加载
    loadedResources.add(url)
}

function preloadImage(url: string) {
    const img = new Image()
    img.src = url
    img.onload = () => log.info(`图片加载成功:${url}`)
    img.onerror = () => log.warn(`图片加载失败:${url}`)
}

function preloadAudio(url: string) {
    const audio = new Audio()
    audio.src = url
    audio.onloadeddata = () => log.info(`音频加载成功:${url}`)
    audio.onerror = () => log.warn(`音频加载失败:${url}`)
}

function preloadVideo(url: string) {
    const video = document.createElement('video')
    video.src = url
    video.onloadeddata = () => log.info(`视频加载成功:${url}`)
    video.onerror = () => log.warn(`视频加载失败:${url}`)
}
