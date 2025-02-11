import { AppEnterEvent, AppLeaveEvent } from '@/core/event'
import { useGameScopeSignal } from '@/core/utils/useScopeSignal'
import { PromiseX } from '@/utils/PromiseX'
import { ActScope, Blocking } from '../../command'
import { Continue } from './system/branch'

export const videoView = useGameScopeSignal<HTMLVideoElement | null>(null)

export type VideoCommandArgs = { file: string }

AppEnterEvent.subscribe(() => videoView()?.play())
AppLeaveEvent.subscribe(() => videoView()?.pause())

export const video = Blocking<VideoCommandArgs>(
    ActScope((context) => async ({ file }) => {
        const {
            store: { config }
        } = context
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
        videoElement.volume = config.globalvolume
        videoView(videoElement)
        await promise
        videoElement.pause()
        videoView(null)
        return Continue.apply(context)({})
    })
)
