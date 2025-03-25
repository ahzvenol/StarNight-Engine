import { ActScope, DynamicBlocking } from '@/core/decorator'
import { SwitchState } from '@/core/types/Meta'
import { useActScopeSignal } from '@/core/utils/useScopeSignal'
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
