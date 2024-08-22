import { range } from "@/utils/range"
import { Reactive, useReactive } from "micro-reactive"
import { createEffect, createMemo } from "solid-js"

// 全局音量
const GolbalVolume = useReactive(1)

// 背景音乐
const BGM = <audio loop autoplay /> as HTMLAudioElement
// 音效
const SE = <audio autoplay /> as HTMLAudioElement
// 人物语音
const Clip = <audio autoplay /> as HTMLAudioElement
// 按钮音效
const BSE = <audio autoplay /> as HTMLAudioElement

const BGMConfigVolumeController = useReactive(1)
const SEConfigVolumeController = useReactive(1)
const ClipConfigVolumeController = useReactive(1)

const BGMUserVolumeController = useReactive(1)
const SEUserVolumeController = useReactive(1)
const ClipUserVolumeController = useReactive(1)

function bindVolume(element: HTMLAudioElement, controller: Array<Reactive<number>>) {
    const volume = createMemo(() => controller.map(n => n()).reduce((n1, n2) => n1 * n2, 1))
    createEffect(() => element.volume = volume())
}

// 音量控制器 0为全局音量,1给config,2给用户
bindVolume(BGM, [GolbalVolume, BGMConfigVolumeController, BGMUserVolumeController])
bindVolume(SE, [GolbalVolume, SEConfigVolumeController, SEUserVolumeController])
bindVolume(Clip, [GolbalVolume, ClipConfigVolumeController, ClipUserVolumeController])
bindVolume(BSE, [GolbalVolume])

// const multiVolumeControl = (element: HTMLAudioElement, count: number) => {
//     if (count < 2) return []
//     const array = new Array<Reactive<number>>(count).fill(useReactive(1))
//     const volume = createMemo(() => array.map(n => n()).reduce((n1, n2) => n1 * n2))
//     createEffect(() => element.volume = volume())
//     return array
// }

// class AudioManager {
//     elements = {} as Dictionary<HTMLAudioElement>
//     constructor() { }
//     add(element: HTMLAudioElement) {

//     }
// }

export {
    GolbalVolume, BGM, SE, Clip, BSE,
    BGMConfigVolumeController,
    SEConfigVolumeController,
    ClipConfigVolumeController,
    BGMUserVolumeController,
    SEUserVolumeController,
    ClipUserVolumeController
}