import { ActScope, DynamicBlocking } from 'starnight'
import { SwitchState } from 'starnight'
import { useActScopeSignal } from 'starnight'
import { wait } from './wait'

export const UIBlindState = useActScopeSignal(SwitchState.Disabled)

export const blind = ActScope(
    DynamicBlocking(
        (context) =>
            function* () {
                UIBlindState(SwitchState.Enabled)
                yield wait.apply(context)({ duration: 300 })
                UIBlindState(SwitchState.Disabled)
            }
    )
)
