import { Reactive, useMemo, useReactive } from "micro-reactive"
import { createEffect, createMemo } from "solid-js"
import { storePromise } from "."

// 全局音量
const GolbalVolume = useReactive(1)

// 背景音乐
const BGM = <audio loop autoplay /> as HTMLAudioElement
// 音效
const SE = <audio autoplay /> as HTMLAudioElement
// 人物语音
const Clip = <audio autoplay /> as HTMLAudioElement
// 按钮音效
const CSE = <audio autoplay src={require("../assets/click.wav")} /> as HTMLAudioElement
const HSE = <audio autoplay src={require("../assets/hover.wav")} /> as HTMLAudioElement

const BGMConfigVolumeController = useReactive(1)
const SEConfigVolumeController = useReactive(1)
const ClipConfigVolumeController = useReactive(1)

const BGMUserVolumeController = useReactive(1)
const SEUserVolumeController = useReactive(1)
const ClipUserVolumeController = useReactive(1)

const clickSoundEffect = () => CSE.cloneNode().play()
const hoverSoundEffect = () => HSE.cloneNode().play()

function bindVolume(element: HTMLAudioElement, controller: Array<Reactive<number>>) {
    const volume = useMemo(() => controller.map(n => n()).reduce((n1, n2) => n1 * n2, 1))
    createEffect(() => element.volume = volume())
}

storePromise.then((store) => {
    // 音量控制器 0为全局音量,1给config,2给用户
    bindVolume(BGM, [GolbalVolume, store.config.BGMVolume, BGMUserVolumeController])
    bindVolume(SE, [GolbalVolume, store.config.SEVolume, SEUserVolumeController])
    bindVolume(Clip, [GolbalVolume, store.config.ClipVolume, ClipUserVolumeController])
    bindVolume(CSE, [GolbalVolume])
    bindVolume(HSE, [GolbalVolume])
})

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
    GolbalVolume, BGM, SE, Clip,
    BGMConfigVolumeController,
    BGMUserVolumeController,
    ClipConfigVolumeController,
    ClipUserVolumeController,
    SEConfigVolumeController,
    SEUserVolumeController,
    clickSoundEffect,
    hoverSoundEffect
}
