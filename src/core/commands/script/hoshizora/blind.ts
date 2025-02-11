import { ActScope, Dynamic } from '@/core/command'
import { useActScopeSignal } from '@/core/utils/useScopeSignal'
import { wait } from '../wait'

export const displayBlindView = useActScopeSignal(false)

export const blind = Dynamic(
    'Normal.Await',
    ActScope(
        (context) =>
            function* () {
                displayBlindView(true)
                yield wait.apply(context)({
                    duration: 300
                }) as unknown as Promise<void>
                displayBlindView(false)
            }
    )
)
