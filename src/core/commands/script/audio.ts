import { CommandLifeCycleFunction, CommandRunFunction, State } from '@/core/Command'
import { useAudioConfig } from '@/store/effect/audioManager'
import { mapValues } from 'es-toolkit'

// 跨幕环境变量file,需要收集副作用

// 音轨数是提前设置的固定的,如果遇到预期之外的音轨应该报错
// 音轨的音量已经与特定变量绑定,如果要实现缓动效果duration,transition需要考虑实现方式

export type AudioCommandArgs = { target?: string; file?: string; duration?: number; loop?: boolean }

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
    ({ state }) =>
    ({ target, file, duration, loop = false }) => {
        if (state === State.Init && target === 'Clip') return
        if (target === undefined) {
            if (duration) mapValues(tracks, (audio) => audio.fade(audio.volume(), 0, duration))
            else mapValues(tracks, (audio) => audio.pause())
        } else {
            if (tracks[target] && duration) tracks[target].fade(tracks[target].volume(), 0, duration)
            if (file !== undefined) {
                tracks[target] = useAudioConfig(
                    target as Parameters<typeof useAudioConfig>[0],
                    new Howl({ src: file, autoplay: true, loop, preload: state !== State.Init })
                )
            }
        }
    }

export const Audio = audio

export const AudioHooks = { afterInit, beforeActStart, onLeft, onActivated }
