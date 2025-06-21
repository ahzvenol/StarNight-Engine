import type { Reactive } from '@starnight/core'
import { ActScope, NonBlocking, StarNight } from '@starnight/core'

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

declare module '@starnight/core' {
    interface GameUIInternalData {
        boxstate: Reactive<boolean>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.boxstate = StarNight.useReactive(true)
})

export const box = ActScope(
    NonBlocking<boolean>(({ ui: { boxstate } }) => (enable) => {
        boxstate(enable)
    })
)
