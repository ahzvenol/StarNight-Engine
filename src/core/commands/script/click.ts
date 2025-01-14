import { NonBlocking } from '@/core/command'
import { SwitchState } from '@/core/types/Meta'
import { Scope, useAutoResetSignal } from '@/core/utils/useAutoResetSignal'

export const clickState = useAutoResetSignal<SwitchState>(() => SwitchState.Enabled, Scope.Game)

export const click = NonBlocking<{ enable: boolean }>(() => ({ enable }) => {
    if (enable) clickState(SwitchState.Enabled)
    else clickState(SwitchState.Disabled)
})
