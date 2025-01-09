import type { HowlOptions } from 'howler'
import type { ExtendArgs } from '@/core/types/Command'
import type { AudioTracksType } from '@/store/hooks/useAudioConfig'
import { isUndefined } from 'es-toolkit'
import { Howl } from 'howler'
import { ActivateEvent, ActStartEvent, CleanupEvent, LeaveEvent, PostInitEvent } from '@/core/event'
import { Dynamic, NonBlocking } from '@/core/normalize'
import { GameState } from '@/core/types/Game'
import { useAudioConfig } from '@/store/hooks/useAudioConfig'

const tracks = new Map<string, Howl>()

PostInitEvent.subscribe(() => tracks.forEach((audio) => audio.load().play()))

ActStartEvent.subscribe(({ store: { config } }) => {
    if (config.interruptclip) tracks.get('Clip')?.stop()
})

ActivateEvent.subscribe(() =>
    tracks.forEach((audio) => {
        if (!audio.playing()) audio.play()
    })
)

LeaveEvent.subscribe(() => tracks.forEach((audio) => audio.pause()))

CleanupEvent.subscribe(() => {
    tracks.forEach((audio) => audio.unload())
    tracks.clear()
})

// 跨幕环境变量file,需要收集副作用
export type SetAudioCommandArgs = {
    type: AudioTracksType
    file: string
    name?: string
} & ExtendArgs<HowlOptions>

export const setAudio = NonBlocking<SetAudioCommandArgs>(({ state }) => ({ type, name = type, file, ...configs }) => {
    // Clip的生命周期是幕,所以不用初始化
    if ((state === GameState.Init || state === GameState.Fast) && type === 'Clip') return
    // 挂载新音频
    const newAudio = useAudioConfig(
        type as AudioTracksType,
        new Howl({
            ...configs,
            src: file,
            autoplay: true,
            preload: state !== GameState.Init
        })
    )
    tracks.set(name, newAudio)
    // 如果音频不是循环的,就不希望它播放完毕之后再被其他事件调用play()了
    if (!configs.loop) newAudio.once('end', () => newAudio.unload())
    // 自动模式需要对Clip计时
    // if (type === 'Clip') return { endAuto: new Promise<void>((res) => newAudio.once('end', () => res())) }
})

export const fadeAudio = Dynamic<{ target: string; volume: number; duration?: number }>(
    () =>
        function* ({ target, volume, duration = 0 }) {
            const audio = tracks.get(target)
            if (!audio) return
            if (!duration) {
                audio.volume(volume)
            } else {
                audio.fade(audio.volume(), volume, duration)
                yield new Promise<void>((res) => audio.once('fade', () => res()))
            }
        }
)

export type CloseAudioCommandArgs = { target?: string }

// 根据名称关闭音轨
// 如果省略了target,关闭全部轨道
export const closeAudio = NonBlocking<CloseAudioCommandArgs>(() => ({ target }) => {
    const targets = isUndefined(target) ? tracks.keys() : [target]
    for (const key of targets) {
        const audio = tracks.get(key)
        tracks.delete(key)
        audio?.unload()
    }
})
