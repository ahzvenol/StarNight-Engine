import { NonBlocking } from '@/core/command'
import { SwitchState } from '@/core/types/Meta'
import { useGameScopeSignal } from '@/core/utils/useScopeSignal'

export const clickState = useGameScopeSignal<SwitchState>(SwitchState.Enabled)

export const click = NonBlocking<{ enable: boolean }>(() => ({ enable }) => {
    if (enable) clickState(SwitchState.Enabled)
    else clickState(SwitchState.Disabled)
})
