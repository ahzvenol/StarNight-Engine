import type { Reactive } from 'starnight'
import { ActScope, Blocking, StarNight } from 'starnight'
import { PromiseX } from '@/core/PromiseX'

declare module 'starnight' {
    interface GameConfig {
        globalvolume: number
    }
    interface GameUIInternalData {
        video: Reactive<HTMLVideoElement | null>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.video = StarNight.useReactive(null)
})
StarNight.GameEvents.suspend.subscribe(({ ui }) => {
    ui.video()?.pause()
})
StarNight.GameEvents.resume.subscribe(({ ui }) => {
    ui.video()?.play()
})

export type VideoCommandArgs = { file: string }

// 作为Blocking命令的原因是快进时需要阻塞
export const video = ActScope(
    Blocking<VideoCommandArgs>((context) => async ({ file }) => {
        const { config, ui } = context
        const { video } = ui
        const promise = new PromiseX<void>()
        const videoElement = (
            <video
                src={file}
                autoplay
                onClick={() => promise.resolve()}
                onEnded={() => promise.resolve()}
                // @ts-expect-error 类型上不存在属性
                disablePictureInPicture
            />
        ) as HTMLVideoElement
        videoElement.volume = config.globalvolume()
        video(videoElement)
        await promise
        videoElement.pause()
        video(null)
        StarNight.SystemCommands.continue.apply(context)({})
    })
)
