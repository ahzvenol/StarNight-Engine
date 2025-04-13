import type { Reactive } from 'starnight'
import { DynamicBlocking, NonBlocking, StarNight } from 'starnight'
import { SwitchState } from '@/core/SwitchState'

declare module 'starnight' {
    interface GameUIInternalData {
        clickState: Reactive<SwitchState>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.clickState = StarNight.useReactive(SwitchState.Enabled)
})

export const click = NonBlocking<{ enable: boolean }>(({ ui: { clickState } }) => ({ enable }) => {
    if (enable) clickState(SwitchState.Enabled)
    else clickState(SwitchState.Disabled)
})

export const check = DynamicBlocking(
    ({ instance: { ClickEvents } }) =>
        function* () {
            yield ClickEvents.onStep()
        }
)
