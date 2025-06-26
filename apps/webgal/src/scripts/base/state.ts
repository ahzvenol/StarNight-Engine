import type { Reactive } from '@starnight/core'
import { ActScope, NonBlocking, StarNight } from '@starnight/core'

declare module '@starnight/core' {
    interface GameUIInternalData {
        state: Reactive<GameUIStateData>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.state = StarNight.useReactive({}) as Reactive<GameUIStateData>
})

interface GameUIStateData {
    click: boolean
}

StarNight.GameEvents.setup.subscribe(({ ui: { state } }) => state.click(true))

export const click = NonBlocking<boolean>(
    ({ ui: { state: { click } } }) =>
        (enable) => {
            click(enable)
        }
)

interface GameUIStateData {
    box: boolean
}

StarNight.GameEvents.setup.subscribe(({ ui: { state } }) => state.box(true))

export const box = ActScope(
    NonBlocking<boolean>(
        ({ ui: { state: { box } } }) =>
            (enable) => {
                box(enable)
            }
    )
)
