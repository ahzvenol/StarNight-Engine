import type { CommandRunFunction } from '@/core/type'
import type { AudioTracksType } from '@/store/effect/audioManager'
import { ActivatedEvent, ActStartEvent, LeftEvent, PostInitEvent, PreInitEvent } from '@/core/event'
import { State } from '@/core/type'
import { useAudioConfig } from '@/store/effect/audioManager'

// 跨幕环境变量file,需要收集副作用
export type AudioCommandArgs = XOR<
    { name: string; file: string; loop?: boolean; type?: AudioTracksType },
    { target?: string }
> & {
    duration?: number
}

const tracks = new Map<string, Howl>()

PreInitEvent.subscribe(() => () => {
    tracks.forEach((audio) => audio.unload())
    tracks.clear()
})

PostInitEvent.subscribe(() => tracks.forEach((audio) => audio.load().play()))

ActStartEvent.subscribe(({ store: { config } }) => {
    if (config.InterruptClip) tracks.get('Clip')?.stop()
})

LeftEvent.subscribe(() => tracks.forEach((audio) => audio.pause()))

ActivatedEvent.subscribe(() =>
    tracks.forEach((audio) => {
        if (!audio.playing()) audio.play()
    })
)

const audio: CommandRunFunction<AudioCommandArgs> =
    ({ state, timer }) =>
    ({ name, type = name, file, loop = false, target, duration = 0 }) => {
        // Clip的生命周期是幕,所以不用初始化
        if ((state === State.Init || state === State.Fast) && type === 'Clip') return
        // 根据名称设置音轨
        if (name !== undefined) {
            // 如果此名称下已有音频,清理它
            const oldAudio = tracks.get(name)
            if (oldAudio && duration)
                oldAudio.fade(oldAudio.volume(), 0, duration).once('fade', () => oldAudio.unload())
            // 挂载新音频
            const audio = useAudioConfig(
                type as AudioTracksType,
                new Howl({
                    src: file,
                    autoplay: true,
                    loop,
                    preload: state !== State.Init
                })
            )
            tracks.set(name, audio)
            // 如果音频不是循环的,就不希望它播放完毕之后再被其他事件调用play()了
            if (!loop) audio.on('end', () => audio.unload())
            if (duration) timer.delay(duration).then(() => audio.fade(0, audio.volume(), duration))
            // 自动模式需要对audio计时
            if (state === State.Auto && type === 'Clip')
                return new Promise<void>((res) => audio.once('end', () => res()))
        } // 根据名称关闭音轨
        else {
            // 如果省略了target,关闭全部轨道
            const targets = target === undefined ? tracks.keys() : [target]
            for (const key of targets) {
                const audio = tracks.get(key)
                tracks.delete(key)
                if (duration) audio?.fade(audio.volume(), 0, duration).once('fade', () => audio.unload())
            }
        }
    }

export const Audio = audio
