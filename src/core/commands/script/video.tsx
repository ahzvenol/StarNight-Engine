import type { CommandRunFunction } from '@/core/type'
import { noInit } from '@/core/macro'
import { PromiseX } from '@/utils/PromiseX'
import { useSignal } from '@/utils/Reactive'
import { Continue } from './!'

export const videoView = useSignal<HTMLVideoElement | null>(null)

// 初始化过程中什么都不做

// video效果只能由系统提供,能做到的事情还很少
const video: CommandRunFunction<{ file: string }> =
    ({ timer, store }) =>
    ({ file }) => {
        const promise = new PromiseX<void>()
        const videoElement = (<video src={file} autoplay onEnded={() => promise.resolve()} />) as HTMLVideoElement
        videoElement.volume = store.config.GolbalVolume
        videoView(videoElement)
        timer.addPauseMethod(videoElement.pause)
        timer.addResumeMethod(videoElement.play)
        timer.addFinalizeMethod(() => {
            videoElement.pause()
            videoView(null)
            promise.resolve()
        })
        return promise.then(() => Continue()()) as Promise<{ continue: boolean }>
    }

export const Video = noInit(video)

export const VideoHooks = { beforeInit: () => videoView(null) }
