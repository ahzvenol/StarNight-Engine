import { DynamicBlocking, NonBlocking } from 'starnight'
import { onClick } from 'starnight'
import { SwitchState } from 'starnight'
import { useGameScopeSignal } from'starnight'

export const UIClickState = useGameScopeSignal<SwitchState>(SwitchState.Enabled)

export const click = NonBlocking<{ enable: boolean }>(() => ({ enable }) => {
    if (enable) UIClickState(SwitchState.Enabled)
    else UIClickState(SwitchState.Disabled)
})

export const check = DynamicBlocking(
    () =>
        function* () {
            yield onClick()
        }
)
