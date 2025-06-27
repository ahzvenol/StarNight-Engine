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
    click: number
}

StarNight.GameEvents.setup.subscribe(({ ui: { state } }) => state.click(0))

export const click = NonBlocking<boolean>(
    ({ ui: { state: { click } } }) =>
        (enable) => {
            click((num) => enable ? (num > 0 ? num - 1 : 0) : num + 1)
        }
)

interface GameUIStateData {
    ui: number
}

StarNight.GameEvents.setup.subscribe(({ ui: { state } }) => state.ui(0))

export const ui = ActScope(
    NonBlocking<boolean>(
        ({ ui: { state: { ui } } }) =>
            (enable) => {
                ui((num) => enable ? (num > 0 ? num - 1 : 0) : num + 1)
            }
    )
)
