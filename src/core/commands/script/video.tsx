/* eslint-disable solid/components-return-once */
import { Scope, useAutoResetSignal } from '@/core/utils/useAutoResetSignal'
import { PromiseX } from '@/utils/PromiseX'
import { ActScope, Dynamic } from '../../normalize'
import { _continue } from './abstract/branch'

export const videoView = useAutoResetSignal<HTMLVideoElement | null>(() => null, Scope.Game)

export type VideoCommandArgs = { file: string }

export const video = Dynamic<VideoCommandArgs>(
    ActScope(
        (context) =>
            function* ({ file }) {
                const { timer, store } = context
                const promise = new PromiseX<void>()
                const videoElement = (
                    <video src={file} autoplay onEnded={() => promise.resolve()} />
                ) as HTMLVideoElement
                videoElement.volume = store.config.golbalvolume
                videoView(videoElement)
                timer.addPauseMethod(videoElement.pause)
                timer.addResumeMethod(videoElement.play)
                yield promise
                videoElement.pause()
                videoView(null)
                return _continue()
            }
    )
)
