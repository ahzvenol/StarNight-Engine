import type { Howl, HowlOptions } from '@/lib/howler'
import { Dynamic, NonBlocking, StarNight } from '@starnight/core'
import { delay, isUndefined } from 'es-toolkit'

export interface AudioTracks {
    clip: Function1<HowlOptions, Howl>
    bgm: Function1<HowlOptions, Howl>
    se: Function1<HowlOptions, Howl>
}

declare module '@starnight/core' {
    interface GameConfig {
        interruptclip: boolean
    }
    interface GameTempData {
        audios: Map<string, Howl>
    }
    interface GameUIExternalData {
        audio: AudioTracks
    }
}

StarNight.GameEvents.setup.subscribe(({ temp }) => {
    temp.audios = new Map()
})

StarNight.GameEvents.ready.subscribe(({ temp: { audios } }) => audios.forEach((audio) => audio.load().play()))

StarNight.GameEvents.suspend.subscribe(({ temp: { audios } }) => audios.forEach((audio) => audio.pause()))

StarNight.GameEvents.resume.subscribe(({ temp: { audios } }) => audios.forEach((audio) => !audio.playing() && audio.play()))

StarNight.GameEvents.exit.subscribe(({ temp: { audios } }) => audios.forEach((audio) => audio.unload()))

StarNight.ActEvents.start.subscribe(({ state, config, temp: { audios } }) => {
    if (!state.isInitializing() && config.interruptclip()) {
        audios.get('clip')?.unload()
    }
})

export type AudioSetCommandArgs = {
    type: keyof AudioTracks
    id?: string
    src: string
    volume?: number
    html5?: boolean | undefined
    loop?: boolean | undefined
    rate?: number | undefined
}

export const set = NonBlocking<AudioSetCommandArgs>(
    ({ state, output: { extime }, ui: { audio: audiotracks }, temp: { audios } }) =>
        ({ type, id = type, ...args }) => {
            const isNotEffectSocpe = state.isInitializing() || state.isFast()
            const isClip = type === 'clip'
            const isNotLoopSE = type === 'se' && args.loop !== true
            // Clip的生命周期是幕,所以不用初始化
            if (isNotEffectSocpe && (isClip || isNotLoopSE)) return
            // 挂载新音频
            const audio = audiotracks[type]({
                ...args,
                pool: 1,
                autoplay: true,
                preload: !state.isInitializing()
            })
            audios.set(id, audio)
            // 如果音频不是循环的,就不希望它播放完毕之后再被其他事件调用play()了
            if (!args.loop) {
                audio.once('end', () => {
                    audio.unload()
                    if (audios.get(id) === audio) {
                        audios.delete(id)
                    }
                })
            }
            if (type === 'clip') extime(new Promise((res) => audio.once('end', res)))
        }
)

export type AudioVolumeCommandArgs = { target: string, volume: number, duration?: number }

export const volume = Dynamic<AudioVolumeCommandArgs>(
    ({ temp: { audios } }) =>
        function* ({ target, volume, duration = 0 }) {
            const audio = audios.get(target)
            // 要设置的音量如果和当前音量相同不会触发fade事件
            if (!audio || audio.volume() === volume) return
            // 非loaded状态的音频无法调整音量,也不能触发fade事件
            if (audio.state() !== 'loaded') yield new Promise<void>((res) => audio.once('load', res))
            if (!duration) {
                audio.volume(volume)
            } else {
                audio.fade(audio.volume(), volume, duration)
                // 为了避免fade到一半被unload等极端情况导致不触发fade事件,使用delay在时间已到时强制释放
                const fade = new Promise<void>((res) => audio.once('fade', () => res()))
                yield Promise.race([fade, delay(duration)])
            }
        }
)

export type AudioCloseCommandArgs = { target?: string }

// 根据名称关闭音轨
// 如果省略了target,关闭全部轨道
export const close = NonBlocking<AudioCloseCommandArgs>(
    ({ temp: { audios } }) =>
        ({ target }) => {
            const targets = isUndefined(target) ? audios.keys() : [target]
            for (const key of targets) {
                const audio = audios.get(key)
                audios.delete(key)
                audio?.unload()
            }
        }
)
