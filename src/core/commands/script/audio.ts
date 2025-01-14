import type { HowlOptions } from 'howler'
import type { ExtendArgs } from '@/core/types/Command'
import type { AudioTracksType } from '@/store/hooks/useAudio'
import { delay, isUndefined } from 'es-toolkit'
import { Howl } from 'howler'
import { Dynamic, NonBlocking } from '@/core/command'
import { ActStartEvent, ContinueGameEvent, GameCleanupEvent, PostInitEvent, ReturnToTitleEvent } from '@/core/event'
import { GameState } from '@/core/types/Game'
import { useAudio } from '@/store/hooks/useAudio'

const tracks = new Map<string, Howl>()

PostInitEvent.subscribe(() => tracks.forEach((audio) => audio.load().play()))

ActStartEvent.subscribe(({ store: { config } }) => {
    if (config.interruptclip) tracks.get('Clip')?.stop()
})

ContinueGameEvent.subscribe(() => tracks.forEach((audio) => audio.play()))

ReturnToTitleEvent.subscribe(() => tracks.forEach((audio) => audio.pause()))

GameCleanupEvent.subscribe(() => {
    tracks.forEach((audio) => audio.unload())
    tracks.clear()
})

// 跨幕环境变量file,需要收集副作用
export type SetAudioCommandArgs = {
    type: AudioTracksType
    file: string
    name?: string
} & ExtendArgs<HowlOptions>

export const setAudio = Dynamic<SetAudioCommandArgs>(
    ({ state }) =>
        function* ({ type, name = type, file, ...configs }) {
            // Clip的生命周期是幕,所以不用初始化
            if ((state === GameState.Init || state === GameState.Fast) && type === 'Clip') return
            // 挂载新音频
            const newAudio = useAudio(
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
            // 这里不能直接从map里移除音频,因为map里可能又是其他的音频了
            if (!configs.loop) newAudio.once('end', () => newAudio.unload())
            // tag:自动模式需要对Clip计时,目前先打一个临时的补丁
            if (type === 'Clip' && state === GameState.Auto) {
                yield new Promise<void>((res) => newAudio.once('end', () => res()))
            }
        }
)

export const fadeAudio = Dynamic<{ target: string; volume: number; duration?: number }>(
    () =>
        function* ({ target, volume, duration = 0 }) {
            const audio = tracks.get(target)
            // 要设置的音量如果和当前音量相同不会触发fade事件
            // 非loaded状态的音频无法调整音量,也不能触发fade事件
            if (!audio || audio.state() !== 'loaded' || audio.volume() === volume) return
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
export const closeAudio = NonBlocking<CloseAudioCommandArgs>(() => ({ target }) => {
    const targets = isUndefined(target) ? tracks.keys() : [target]
    for (const key of targets) {
        const audio = tracks.get(key)
        tracks.delete(key)
        audio?.unload()
    }
})
