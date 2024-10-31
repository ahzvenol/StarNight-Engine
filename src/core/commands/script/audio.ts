import { mapValues } from 'es-toolkit'
import { CommandLifeCycleFunction, CommandRunFunction, State } from '@/core/type'
import { AudioTracksType, useAudioConfig } from '@/store/effect/audioManager'

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
        if (state === State.Init && target === 'Clip') return
        // 根据名称设置音轨
        if (name !== undefined) {
            if (tracks[name] && duration) tracks[name].fade(tracks[name].volume(), 0, duration)
            const audio = useAudioConfig(
                type as AudioTracksType,
                new Howl({ src: file, autoplay: true, loop, preload: state !== State.Init })
            )
            if (duration) timer.delay(duration).then(() => audio.fade(0, audio.volume(), duration))
        } // 根据名称关闭音轨
        else if (target === undefined) {
            for (const key of target === undefined ? Object.keys(tracks) : [target]) {
                const audio = tracks[key]
                delete tracks[key]
                if (duration) audio?.fade(audio.volume(), 0, duration)
                timer.delay(duration).then(() => audio?.stop())
            }
        }
    }

export const Audio = audio

export const AudioHooks = { afterInit, beforeActStart, onLeft, onActivated }
