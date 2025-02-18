import { ActScope, DynamicBlocking } from '@/core/decorator'
import { useActScopeSignal } from '@/core/utils/useScopeSignal'
import { wait } from './wait'

export const displayBlindView = useActScopeSignal(false)

export const blind = ActScope(
    DynamicBlocking(
        (context) =>
            function* () {
                displayBlindView(true)
                yield wait.apply(context)({ duration: 300 })
                displayBlindView(false)
            }
    )
)
