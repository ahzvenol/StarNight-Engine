import type { Reactive } from '@starnight/core'
import { ActScope, Blocking, StarNight } from '@starnight/core'
import { PromiseX } from '@/core/PromiseX'
import { System } from '.'

declare module '@starnight/core' {
    interface GameUIInternalData {
        video: Reactive<VideoItem | null>
    }
}

type VideoItem = { src: string, race: Function0<void> | null }

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.video = StarNight.useReactive(null)
})

export type VideoCommandArgs = { src: string, skip?: false }

// 作为Blocking命令的原因是快进时需要阻塞
export const use = ActScope(
    Blocking<VideoCommandArgs>((context) => async ({ src, skip = true }) => {
        const { ui: { video } } = context
        const promise = new PromiseX<void>()
        video({ src, race: skip ? promise.resolve : null })
        await promise.then(() => video(null))
        System.cont()(context)
    })
)
