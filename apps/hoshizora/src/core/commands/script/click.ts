import type { Reactive } from 'starnight'
import { DynamicBlocking, NonBlocking, StarNight } from 'starnight'
import { SwitchState } from '@/core/SwitchState'

declare module 'starnight' {
    interface GameUIInternalData {
        clickstate: Reactive<SwitchState>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.clickstate = StarNight.useReactive(SwitchState.Enabled)
})

export const click = NonBlocking<{ enable: boolean }>(({ ui: { clickstate } }) => ({ enable }) => {
    if (enable) clickstate(SwitchState.Enabled)
    else clickstate(SwitchState.Disabled)
})

export const check = DynamicBlocking(
    ({ instance: { ClickEvents } }) =>
        function* () {
            yield ClickEvents.onStep()
        }
)
