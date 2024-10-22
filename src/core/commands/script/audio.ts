import { CommandLifeCycleFunction, CommandRunFunction } from '@/core/Command'
import { BGM, SE, Clip } from '@/store/effect/audioManager'
import { mapValues } from 'es-toolkit'

// 跨幕环境变量file,需要收集副作用

// 音轨数是提前设置的固定的,如果遇到预期之外的音轨应该报错
// 音轨的音量已经与特定变量绑定,如果要实现缓动效果duration,transition需要考虑实现方式

export type AudioCommandArgs = { target?: string; file: string }

export const tracks = { BGM, SE, Clip }

const init: CommandRunFunction<AudioCommandArgs> =
    () =>
    ({ target, file }) => {
        if (target === 'Clip') return
        if (target === undefined) mapValues(tracks, (audio) => (audio.meta = ''))
        else tracks[target as keyof typeof tracks].meta = file
    }

const afterInit: CommandLifeCycleFunction = () => mapValues(tracks, (audio) => (audio.src = audio.meta))

const onActStart: CommandLifeCycleFunction = (context) => {
    if (context.store.config.InterruptClip) Clip.src = ''
}

const set: CommandRunFunction<AudioCommandArgs> =
    () =>
    ({ target, file }) => {
        if (target === undefined) mapValues(tracks, (audio) => (audio.src = ''))
        else tracks[target as keyof typeof tracks].src = file
    }

export const Audio = { init, afterInit, onActStart, run: set }
