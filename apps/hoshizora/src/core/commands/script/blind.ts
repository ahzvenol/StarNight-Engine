import { ActScope, DynamicBlocking, SystemCommands } from 'starnight'
import { SwitchState } from 'starnight'
import { useActScopeSignal } from 'starnight'

export const UIBlindState = useActScopeSignal(SwitchState.Disabled)

export const blind = ActScope(
    DynamicBlocking(
        (context) =>
            function* () {
                UIBlindState(SwitchState.Enabled)
                yield SystemCommands.wait.apply(context)({ duration: 300 })
                UIBlindState(SwitchState.Disabled)
            }
    )
)
