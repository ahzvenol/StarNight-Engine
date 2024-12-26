import type { AudioTracksType } from '@/store/hooks/useAudioConfig'
import { ActivatedEvent, ActStartEvent, LeftEvent, PostInitEvent, PreInitEvent } from '@/core/event'
import { Dynamic, NonBlocking } from '@/core/flow'
import { GameState } from '@/core/types/Game'
import { useAudioConfig } from '@/store/hooks/useAudioConfig'

// 跨幕环境变量file,需要收集副作用
export type SetAudioCommandArgs = {
    type: AudioTracksType
    file: string
    loop?: boolean
    name?: string
    duration?: number
}

const tracks = new Map<string, Howl>()

PreInitEvent.subscribe(() => () => {
    tracks.forEach((audio) => audio.unload())
    tracks.clear()
})

PostInitEvent.subscribe(() => tracks.forEach((audio) => audio.load().play()))

ActStartEvent.subscribe(({ store: { config } }) => {
    if (config.interruptclip) tracks.get('Clip')?.stop()
})

LeftEvent.subscribe(() => tracks.forEach((audio) => audio.pause()))

ActivatedEvent.subscribe(() =>
    tracks.forEach((audio) => {
        if (!audio.playing()) audio.play()
    })
)

export const setAudio = Dynamic<SetAudioCommandArgs>(
    ({ state }) =>
        function* ({ type, name = type, file, loop = false, duration = 0 }) {
            // Clip的生命周期是幕,所以不用初始化
            if ((state === GameState.Init || state === GameState.Fast) && type === 'Clip') return
            // 根据名称设置音轨
            const oldAudio = tracks.get(name)
            // 挂载新音频
            const newAudio = useAudioConfig(
                type as AudioTracksType,
                new Howl({
                    src: file,
                    autoplay: true,
                    loop: loop,
                    preload: state !== GameState.Init
                })
            )
            // 如果音频不是循环的,就不希望它播放完毕之后再被其他事件调用play()了
            if (!loop) newAudio.once('end', () => newAudio.unload())
            tracks.set(name, newAudio)
            // 如果此名称下已有音频,清理它
            if (oldAudio && duration) {
                oldAudio.fade(oldAudio.volume(), 0, duration)
                yield new Promise((res) => oldAudio.once('fade', () => res()))
                // 放弃缓动直接卸载音频是必须的,否则同时运行多个音频会很糟糕
                oldAudio.unload()
            }
            if (duration) newAudio.fade(0, newAudio.volume(), duration)
            // 自动模式需要对audio计时
            if (type === 'Clip') yield new Promise<void>((res) => newAudio.once('end', () => res()))
        }
)

export type CloseAudioCommandArgs = { target?: string; duration?: number }

// 根据名称关闭音轨
// 如果省略了target,关闭全部轨道
export const closeAudio = NonBlocking<CloseAudioCommandArgs>(() => ({ target, duration = 0 }) => {
    const targets = target === undefined ? tracks.keys() : [target]
    for (const key of targets) {
        const audio = tracks.get(key)
        tracks.delete(key)
        if (duration) {
            audio?.fade(audio.volume(), 0, duration).once('fade', () => audio.unload())
        }
    }
})
