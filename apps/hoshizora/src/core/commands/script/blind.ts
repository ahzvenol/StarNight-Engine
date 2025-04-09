import { ActScope, DynamicBlocking, StarNight, SwitchState, useActScopeSignal } from 'starnight'

export const UIBlindState = useActScopeSignal(SwitchState.Disabled)

export const blind = ActScope(
    DynamicBlocking(
        (context) =>
            function* () {
                UIBlindState(SwitchState.Enabled)
                yield StarNight.commands.wait.apply(context)({ duration: 300 })
                UIBlindState(SwitchState.Disabled)
            }
    )
)
