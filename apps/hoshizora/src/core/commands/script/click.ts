import type { Reactive } from '@starnight/core'
import { DynamicBlocking, NonBlocking, StarNight } from '@starnight/core'
import { SwitchState } from '@/core/SwitchState'

declare module '@starnight/core' {
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
