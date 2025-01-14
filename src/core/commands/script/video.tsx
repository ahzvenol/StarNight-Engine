import { AppEnterEvent, AppLeaveEvent } from '@/core/event'
import { Scope, useAutoResetSignal } from '@/core/utils/useAutoResetSignal'
import { PromiseX } from '@/utils/PromiseX'
import { ActScope, Dynamic } from '../../command'
import { _continue } from './abstract/branch'

export const videoView = useAutoResetSignal<HTMLVideoElement | null>(() => null, Scope.Game)

export type VideoCommandArgs = { file: string }

AppEnterEvent.subscribe(() => videoView()?.play())
AppLeaveEvent.subscribe(() => videoView()?.pause())

export const video = Dynamic<VideoCommandArgs>(
    ActScope(
        ({ store: { config } }) =>
            function* ({ file }) {
                const promise = new PromiseX<void>()
                const videoElement = (
                    <video src={file} autoplay onEnded={() => promise.resolve()} />
                ) as HTMLVideoElement
                videoElement.volume = config.golbalvolume
                videoView(videoElement)
                yield promise
                videoElement.pause()
                videoView(null)
                return _continue()
            }
    )
)
