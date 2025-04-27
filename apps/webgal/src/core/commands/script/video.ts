import type { Reactive } from '@starnight/core'
import { ActScope, Blocking, StarNight } from '@starnight/core'
import { PromiseX } from '@/core/PromiseX'

declare module '@starnight/core' {
    interface GameConfig {
        globalvolume: number
    }
    interface GameUIInternalData {
        video: Reactive<VideoItem | null>
    }
}

type VideoItem = {
    src: string
    race: () => void
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.video = StarNight.useReactive(null)
})

export type VideoCommandArgs = { src: string }

// 作为Blocking命令的原因是快进时需要阻塞
export const video = ActScope(
    Blocking<VideoCommandArgs>((context) => async ({ src }) => {
        const { ui } = context
        const { video } = ui
        const promise = new PromiseX<void>()
        video({ src, race: promise.resolve })
        await promise.then(() => video(null))
        StarNight.SystemCommands.continue.apply(context)({})
    })
)
