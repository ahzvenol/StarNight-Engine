/* eslint-disable solid/components-return-once */
import type { DynamicCommand } from '../../type'
import { State } from '@/core/type'
import { Scope, useAutoResetSignal } from '@/core/useScopeSignal'
import { PromiseX } from '@/utils/PromiseX'
import { Continue } from './!'

export const videoView = useAutoResetSignal<HTMLVideoElement | null>(() => null, Scope.Game)

export type VideoCommandArgs = { file: string }
// 初始化过程中什么都不做
// video效果只能由系统提供,能做到的事情还很少
export const video: DynamicCommand<VideoCommandArgs> = ({ state, timer, store }) =>
    function* ({ file }) {
        if (state === State.Init) return
        const promise = new PromiseX<void>()
        const videoElement = (<video src={file} autoplay onEnded={() => promise.resolve()} />) as HTMLVideoElement
        videoElement.volume = store.config.GolbalVolume
        videoView(videoElement)
        timer.addPauseMethod(videoElement.pause)
        timer.addResumeMethod(videoElement.play)
        yield promise
        videoElement.pause()
        videoView(null)
        return Continue()()
    }
