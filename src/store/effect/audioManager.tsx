import { useSignal } from '@/utils/Reactive'
import { Reactive } from 'micro-reactive'
import { createEffect, createMemo } from 'solid-js'
import { storePromise } from '../store'

const configVolumeControllerMapPromise = storePromise.then((store) => ({
    Golbal: store.config.GolbalVolume,
    BGM: store.config.BGMVolume,
    SE: store.config.SEVolume,
    Clip: store.config.ClipVolume,
    UISE: store.config.UISEVolume
}))

function createAudioTrack(type: 'BGM' | 'SE' | 'Clip' | 'UISE', userVolumeController: Reactive<number> = () => 1) {
    const audio = new Audio()
    audio.autoplay = type === 'UISE' ? false : true

    // 为audio绑定响应式音量控制,音量=全局音量*设置音量*命令音量(用于淡入淡出等效果)
    configVolumeControllerMapPromise.then((map) => {
        const controller = [map['Golbal'], map[type], userVolumeController]
        const volume = createMemo(() => controller.map((n) => n()).reduce((n1, n2) => n1 * n2, 1))
        createEffect(() => (audio.volume = volume()))
    })

    // 在离开页面时暂停audio,在返回页面时恢复
    let pausedState = true
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            pausedState = audio.paused
            audio.pause()
        }

        if (document.visibilityState === 'visible') {
            if (pausedState === false) {
                audio.play()
            }
        }
    })

    // 重复赋值相同的src也会导致audio从头开始播放,在这种情况下跳过赋值
    let currentSrc = ''
    Object.defineProperty(audio, 'src', {
        get() {
            return currentSrc
        },
        set(value) {
            if (value === currentSrc) return
            currentSrc = value
            audio.setAttribute('src', value)
        }
    })

    return audio
}

// 全局音量
const GolbalVolume = useSignal(1)

const BGMUserVolumeController = useSignal(1)
const SEUserVolumeController = useSignal(1)
const ClipUserVolumeController = useSignal(1)
// 背景音乐
const BGM = createAudioTrack('BGM', BGMUserVolumeController)
BGM.loop = true
// 音效
const SE = createAudioTrack('SE', SEUserVolumeController)
// 人物语音
const Clip = createAudioTrack('Clip', ClipUserVolumeController)
// 按钮音效

export {
    GolbalVolume,
    BGM,
    BGMUserVolumeController,
    Clip,
    ClipUserVolumeController,
    SE,
    SEUserVolumeController,
    createAudioTrack
}
