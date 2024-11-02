import type { CommandLifeCycleFunction, CommandRunFunction } from '@/core/type'
import type { AudioTracksType } from '@/store/effect/audioManager'
import { mapValues } from 'es-toolkit'
import { State } from '@/core/type'
import { useAudioConfig } from '@/store/effect/audioManager'
import { PromiseX } from '@/utils/PromiseX'

// 跨幕环境变量file,需要收集副作用
export type AudioCommandArgs = XOR<
    { name: string; file: string; loop?: boolean; type?: AudioTracksType },
    { target?: string }
> & {
    duration?: number
}

const tracks: Record<string, Howl> = {}

const afterInit: CommandLifeCycleFunction = () => mapValues(tracks, (audio) => audio.load().play())

const beforeActStart: CommandLifeCycleFunction = ({ store: { config } }) => {
    if (config.InterruptClip) tracks['Clip']?.stop()
}

const onLeft: CommandLifeCycleFunction = () => mapValues(tracks, (audio) => audio.pause())

const onActivated: CommandLifeCycleFunction = () =>
    mapValues(tracks, (audio) => {
        if (!audio.playing()) audio.play()
    })

const audio: CommandRunFunction<AudioCommandArgs> =
    ({ state, timer }) =>
    ({ name, type = name, file, loop = false, target, duration = 0 }) => {
        // Clip的生命周期是幕,所以不用初始化
        if ((state === State.Init || state === State.Fast) && type === 'Clip') return
        // 根据名称设置音轨
        if (name !== undefined) {
            // 如果此名称下已有音频,清理它
            const oldAudio = tracks[name]
            if (oldAudio && duration) oldAudio.fade(oldAudio.volume(), 0, duration)
            timer.delay(duration).then(() => oldAudio?.stop())
            // 挂载新音频
            const promise = new PromiseX<void>()
            const audio = useAudioConfig(
                type as AudioTracksType,
                new Howl({
                    src: file,
                    autoplay: true,
                    loop,
                    preload: state !== State.Init,
                    onend: () => {
                        promise.resolve()
                    }
                })
            )
            tracks[name] = audio
            if (duration) timer.delay(duration).then(() => audio.fade(0, audio.volume(), duration))
            // 自动模式需要对audio计时
            if (state === State.Auto && type === 'Clip') return promise
        } // 根据名称关闭音轨
        else {
            // 如果省略了target,关闭全部轨道
            const targets = target === undefined ? Object.keys(tracks) : [target]
            for (const key of targets) {
                const audio = tracks[key]
                delete tracks[key]
                if (duration) audio?.fade(audio.volume(), 0, duration)
                timer.delay(duration).then(() => audio?.stop())
            }
        }
    }

export const Audio = audio

export const AudioHooks = { afterInit, beforeActStart, onLeft, onActivated }
