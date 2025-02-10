import { SwitchState } from '@/core/types/Meta'
import { useActScopeSignal } from '@/core/utils/useScopeSignal'
import { ActScope, Dynamic, NonBlocking } from '../../command'
import { wait } from './wait'

export const textPreview = useActScopeSignal('')
export const preview = NonBlocking<{ text: string }>(
    ActScope(() => ({ text }) => {
        textPreview(text)
    })
)

export const showSuffixIconView = useActScopeSignal(false)

export const icon = NonBlocking(
    ActScope(() => () => {
        showSuffixIconView(true)
    })
)

export const textView = useActScopeSignal('')
export const text = Dynamic<{ text: string }>(
    ActScope(
        (context) =>
            function* ({ text }) {
                while (text.length >= 1) {
                    yield wait.apply(context)({
                        duration: 100 - context.store.config.textspeed * 100
                    }) as unknown as Promise<void>
                    textView((i) => i + text.charAt(0))
                    text = text.slice(1)
                }
            }
    )
)

export const nameView = useActScopeSignal('')

export const name = NonBlocking<{ name: string }>(() => ({ name }) => {
    nameView(name)
})

export const textboxState = useActScopeSignal<SwitchState>(SwitchState.Enabled)

export const textbox = NonBlocking<{ enable: boolean }>(() => ({ enable }) => {
    if (enable) textboxState(SwitchState.Enabled)
    else textboxState(SwitchState.Disabled)
})
