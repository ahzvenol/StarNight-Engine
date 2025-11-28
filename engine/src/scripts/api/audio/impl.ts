import type { Howl, HowlConstructor } from '@/lib/howler'
import { Dynamic, DynamicMacro, NonBlocking, StarNight } from '@starnight/core'
import { delay } from 'es-toolkit'

export interface AudioTracks {
    clip: HowlConstructor
    bgm: HowlConstructor
    se: HowlConstructor
}

declare module '@starnight/core' {
    interface GameConfig {
        interruptclip: boolean
    }
    interface GameTempData {
        audiomap: Map<string | symbol, Howl>
    }
    interface GameUIExternalData {
        audio: AudioTracks
    }
}

StarNight.GameEvents.setup.subscribe(({ temp }) => {
    temp.audiomap = new Map()
})

StarNight.GameEvents.ready.subscribe(({ temp: { audiomap } }) => audiomap.forEach((audio) => audio.load().play()))

StarNight.GameEvents.suspend.subscribe(({ temp: { audiomap } }) => audiomap.forEach((audio) => audio.pause()))

StarNight.GameEvents.resume.subscribe(({ temp: { audiomap } }) => audiomap.forEach((audio) => !audio.playing() && audio.play()))

StarNight.GameEvents.exit.subscribe(({ temp: { audiomap } }) => audiomap.forEach((audio) => audio.unload()))

StarNight.ActEvents.start.subscribe(({ state, config, temp: { audiomap } }) => {
    if (!state.isInitializing() && config.interruptclip()) {
        audiomap.get('clip')?.unload()
    }
})

export type AudioSetCommandArgs = {
    track: keyof AudioTracks,
    target: string | symbol,
    src: string,
    volume?: number,
    html5?: boolean,
    loop?: boolean,
    rate?: number
}

export const set = NonBlocking<AudioSetCommandArgs>(
    ({ state, output: { extime }, ui: { audio: audiotracks }, temp: { audiomap } }) =>
        ({ track, target, ...args }) => {
            const isNotEffectSocpe = state.isInitializing() || state.isFast()
            const isClip = track === 'clip'
            const isNotLoopSE = track === 'se' && args.loop !== true
            // Clip的生命周期是幕,所以不用初始化,不循环的SE也是如此
            if (isNotEffectSocpe && (isClip || isNotLoopSE)) return
            // 挂载新音频
            const audio = new audiotracks[track]({
                ...args,
                pool: 1,
                autoplay: true,
                preload: !state.isInitializing()
            })
            audiomap.set(target, audio)
            // 如果音频不是循环的,就不希望它播放完毕之后再被其他事件调用play()了
            if (!args.loop) {
                audio.once('end', () => {
                    audio.unload()
                    if (audiomap.get(target) === audio) {
                        audiomap.delete(target)
                    }
                })
            }
            if (track === 'clip') extime(new Promise((res) => audio.once('end', res)))
        }
)

export type AudioVolumeCommandArgs = { target: string | symbol, volume: number, duration?: number }

export const volume = Dynamic<AudioVolumeCommandArgs>(
    ({ temp: { audiomap } }) =>
        function* ({ target, volume, duration }) {
            const audio = audiomap.get(target)
            if (audio) {
                if (!duration) {
                    audio.volume(volume)
                } else {
                    audio.fade(audio.volume(), volume, duration * 1000)
                    // 音频加载中或已卸载时,fade事件不会在预期时间触发,使用delay强制释放
                    const fade = new Promise((res) => audio.once('fade', res))
                    yield Promise.race([fade, delay(duration * 1000)])
                }
            }
        }
)

export type AudioCloseCommandArgs = { target: string | symbol, duration?: number }

// 根据名称关闭音轨
export const close = DynamicMacro<AudioCloseCommandArgs>(
    ({ temp: { audiomap } }) =>
        function* ({ target, duration }) {
            const audio = audiomap.get(target)
            if (audio) {
                audiomap.delete(target)
                if (duration) {
                    const sysbol = Symbol()
                    audiomap.set(sysbol, audio)
                    yield yield volume({
                        volume: 0,
                        target: sysbol,
                        duration
                    })
                    audiomap.delete(sysbol)
                }
                audio.unload()
            }
        }
)
