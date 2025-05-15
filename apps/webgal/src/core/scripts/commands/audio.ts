import type { Except } from 'type-fest'
import type { Howl, HowlOptions } from '@/lib/howler'
import { Dynamic, Macro, NonBlocking, StarNight } from '@starnight/core'
import { delay, isUndefined } from 'es-toolkit'

declare module '@starnight/core' {
    interface GameConfig {
        interruptclip: boolean
    }
    interface GameTempData {
        audios: Map<string, Howl>
    }
    interface GameUIExternalData {
        audiotracks: {
            clip: Function1<HowlOptions, Howl>
            bgm: Function1<HowlOptions, Howl>
            se: Function1<HowlOptions, Howl>
        } & Record<string, Function1<HowlOptions, Howl>>
    }
}

StarNight.GameEvents.setup.subscribe(({ temp }) => {
    temp.audios = new Map()
})

StarNight.ActEvents.ready.subscribe(({ temp: { audios } }) => audios.forEach((audio) => audio.load().play()))

StarNight.ActEvents.start.subscribe(({ config, temp: { audios } }) => {
    if (config.interruptclip()) audios.get('clip')?.unload()
})

StarNight.GameEvents.suspend.subscribe(({ temp: { audios } }) => audios.forEach((audio) => audio.pause()))

StarNight.GameEvents.resume.subscribe(({ temp: { audios } }) =>
    audios.forEach((audio) => {
        if (!audio.playing()) audio.play()
    })
)

StarNight.GameEvents.exit.subscribe(({ temp: { audios } }) => audios.forEach((audio) => audio.unload()))

export type AudioSetCommandArgs = {
    type: string
    id?: string
    src: string
    volume?: number
    html5?: boolean | undefined
    loop?: boolean | undefined
    rate?: number | undefined
}
export const set = NonBlocking<AudioSetCommandArgs>(
    ({ state, output: { extime }, ui: { audiotracks }, temp: { audios } }) =>
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
            extime(new Promise((res) => audio.once('end', res)))
        }
)

export type AudioVolumeCommandArgs = { target: string; volume: number; duration?: number }

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
export const close = NonBlocking<AudioCloseCommandArgs>(({ temp: { audios } }) => ({ target }) => {
    const targets = isUndefined(target) ? audios.keys() : [target]
    for (const key of targets) {
        const audio = audios.get(key)
        audios.delete(key)
        audio?.unload()
    }
})

export const bgm = Macro<Except<AudioSetCommandArgs, 'type'> & { duration?: number }>(
    () =>
        async function* (_args) {
            const args = { loop: true, ..._args, type: 'bgm' }
            args.id = args.id || args.type
            if (args.duration) {
                yield volume({ target: args.id, volume: 0, duration: args.duration })
                yield close({ target: args.id })
                yield set({ volume: 0, ...args })
                yield volume({ target: args.id, volume: args.volume || 1, duration: args.duration })
            } else {
                yield close({ target: args.id })
                yield set({ volume: args.volume || 1, ...args })
            }
        }
)

export const se = Macro<Except<AudioSetCommandArgs, 'type'> & { duration?: number }>(
    () =>
        async function* (_args) {
            const args = { ..._args, type: 'se' }
            args.id = args.id || args.type
            if (args.duration) {
                yield volume({ target: args.id, volume: 0, duration: args.duration })
                yield close({ target: args.id })
                yield set({ volume: 0, ...args })
                yield volume({ target: args.id, volume: args.volume || 1, duration: args.duration })
            } else {
                yield close({ target: args.id })
                yield set({ volume: args.volume || 1, ...args })
            }
        }
)

export const clip = Macro<Except<AudioSetCommandArgs, 'type' | 'id'>>(
    () =>
        async function* (_args) {
            const args = { ..._args, type: 'clip', id: 'clip' }
            yield close({ target: args.id })
            yield set(Object.assign({ volume: args.volume || 1 }, args))
        }
)

export const fade_close = Macro<{ target: string; duration?: number }>(
    (context) =>
        async function* (args) {
            await volume({ volume: 0, ...args })(context)
            yield close({ target: args.target })
        }
)
