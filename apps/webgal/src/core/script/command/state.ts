import type { Reactive } from '@starnight/core'
import { ActScope, NonBlocking, StarNight } from '@starnight/core'

declare module '@starnight/core' {
    interface GameUIInternalData {
        textboxstate: Reactive<boolean>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.textboxstate = StarNight.useReactive(true)
})

export const textbox = ActScope(
    NonBlocking<boolean>(({ ui: { textboxstate } }) => (enable) => {
        textboxstate(enable)
    })
)

declare module '@starnight/core' {
    interface GameUIInternalData {
        clickstate: Reactive<boolean>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.clickstate = StarNight.useReactive(true)
})

export const click = NonBlocking<boolean>(({ ui: { clickstate } }) => (enable) => {
    clickstate(enable)
})
