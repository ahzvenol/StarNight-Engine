import { SwitchState } from '@/core/SwitchState'
import { DynamicBlocking, NonBlocking, Reactive, StarNight} from 'starnight'

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
