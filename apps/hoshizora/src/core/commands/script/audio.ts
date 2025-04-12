import type { ExtendArgs } from 'starnight'
import type { Howl, HowlConstructor, HowlOptions } from '@/lib/howler'
import { delay, isUndefined } from 'es-toolkit'
import { Dynamic, GameState, NonBlocking, StarNight } from 'starnight'

declare module 'starnight' {
    interface GameConfig {
        interruptclip: boolean
    }
    interface GameTempData {
        audios: Map<string, Howl>
    }
    interface GameUIExternalData {
        audioTracks: Record<string, Function1<HowlOptions, Howl>>
    }
}

StarNight.GameEvents.setup.subscribe(({ temp }) => {
    temp.audios = new Map()
})

StarNight.ActEvents.ready.subscribe(({ temp: { audios } }) => audios.forEach((audio) => audio.load().play()))

StarNight.ActEvents.start.subscribe(({ config, temp: { audios } }) => {
    if (config.interruptclip()) audios.get('Clip')?.unload()
})

StarNight.GameEvents.suspend.subscribe(({ temp: { audios } }) => audios.forEach((audio) => audio.pause()))

StarNight.GameEvents.resume.subscribe(({ temp: { audios } }) =>
    audios.forEach((audio) => {
        if (!audio.playing()) audio.play()
    })
)

StarNight.GameEvents.exit.subscribe(({ temp: { audios } }) => audios.forEach((audio) => audio.unload()))

// 跨幕环境变量file,需要收集副作用
export type SetAudioCommandArgs = {
    type: string
    file: string
    name?: string
} & ExtendArgs<HowlOptions>

export const setaudio = Dynamic<SetAudioCommandArgs>(
    ({ state, ui: { audioTracks }, temp: { audios } }) =>
        function* ({ type, name = type, file, ...configs }) {
            // Clip的生命周期是幕,所以不用初始化
            if (
                (state === GameState.Init || state === GameState.Fast) &&
                (type === 'Clip' || (type === 'SE' && configs.loop !== true))
            ) {
                return
            }
            // 挂载新音频
            const audio = audioTracks[type]({
                ...configs,
                pool: 1,
                src: file,
                autoplay: true,
                preload: state !== GameState.Init
            })

            audios.set(name, audio)
            // 如果音频不是循环的,就不希望它播放完毕之后再被其他事件调用play()了
            if (!configs.loop) {
                audio.once('end', () => {
                    audio.unload()
                    if (audios.get(name) === audio) {
                        audios.delete(name)
                    }
                })
            }
            // tag:自动模式需要对Clip计时,目前先打一个临时的补丁
            if (type === 'Clip' && state === GameState.Auto) {
                yield new Promise((res) => audio.once('end', res))
            }
        }
)

export type FadeAudioCommandArgs = { target: string; volume: number; duration?: number }

export const fadeaudio = Dynamic<FadeAudioCommandArgs>(
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
                // 为了避免fade到一半被unload等极端情况导致不触发fade事件,使用race和delay在时间已到时强制释放
                const fade = new Promise<void>((res) => audio.once('fade', () => res()))
                yield Promise.race([fade, delay(duration)])
            }
        }
)

export type CloseAudioCommandArgs = { target?: string }

// 根据名称关闭音轨
// 如果省略了target,关闭全部轨道
export const closeaudio = NonBlocking<CloseAudioCommandArgs>(({ temp: { audios } }) => ({ target }) => {
    const targets = isUndefined(target) ? audios.keys() : [target]
    for (const key of targets) {
        const audio = audios.get(key)
        audios.delete(key)
        audio?.unload()
    }
})
