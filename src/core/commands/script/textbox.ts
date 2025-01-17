import { inRange } from 'es-toolkit'
import { SwitchState } from '@/core/types/Meta'
import { useActScopeSignal } from '@/core/utils/useScopeSignal'
import { Y } from '@/utils/fp'
import { arrayToInterval, intervalToArray } from '@/utils/zipNumArray'
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

export const readIndicatorView = useActScopeSignal(false)

export const textView = useActScopeSignal('')
export const text = Dynamic<{ text: string }>(
    ActScope(
        (context) =>
            function* ({ text }) {
                const { index, store } = context
                const global = context.variables.global
                if (global.segment().some((i) => inRange(index, i[0], i[1] + 1))) {
                    readIndicatorView(true)
                } else {
                    global.segment(arrayToInterval([...intervalToArray(global.segment()), index]))
                }

                yield* Y<string, Generator<Promise<void>, void, void>>(
                    (rec) =>
                        function* (str): Generator<Promise<void>, void, void> {
                            yield wait.apply(context)({
                                duration: store.config.textspeed * 100
                            }) as unknown as Promise<void>
                            textView((text) => text + str.charAt(0))
                            if (str.length >= 1) yield* rec(str.slice(1))
                        }
                )(text)
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
