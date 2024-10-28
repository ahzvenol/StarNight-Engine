import { CommandLifeCycleFunction, CommandRunFunction, State } from '@/core/Command'
import { BGM, SE, Clip } from '@/store/effect/audioManager'
import { mapValues } from 'es-toolkit'

// 跨幕环境变量file,需要收集副作用

// 音轨数是提前设置的固定的,如果遇到预期之外的音轨应该报错
// 音轨的音量已经与特定变量绑定,如果要实现缓动效果duration,transition需要考虑实现方式

export type AudioCommandArgs = { target?: string; file: string; duration?: number; loop?: boolean }

export const tracks = { BGM, SE, Clip }

const afterInit: CommandLifeCycleFunction = () => mapValues(tracks, (audio) => (audio.src = audio.meta))

const onActStart: CommandLifeCycleFunction = ({ store: { config } }) => {
    if (config.InterruptClip) Clip.src = ''
}

const audio: CommandRunFunction<AudioCommandArgs> =
    ({ state }) =>
    ({ target, file, duration, loop = false }) => {
        if ((state === State.Init && target) === 'Clip') return
        const type = state === State.Init ? 'meta' : 'src'
        if (target === undefined) mapValues(tracks, (audio) => (audio[type] = ''))
        else tracks[target as keyof typeof tracks][type] = file
    }

export const Audio = audio

export const AudioHooks = { afterInit, onActStart }
