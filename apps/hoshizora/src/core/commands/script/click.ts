import { DynamicBlocking, NonBlocking } from '@/core/decorator'
import { onClick } from '@/core/event'
import { SwitchState } from '@/core/types/Meta'
import { useGameScopeSignal } from '@/core/utils/useScopeSignal'

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
