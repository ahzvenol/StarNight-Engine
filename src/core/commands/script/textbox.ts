import { inRange } from 'es-toolkit'
import { Scope, useAutoResetSignal } from '@/core/utils/useScopeSignal'
import { Y } from '@/utils/fp'
import { arrayToInterval, intervalToArray } from '@/utils/zipNumArray'
import { ActScope, Dynamic, NonBlocking } from '../../normalize'
import { _wait } from './abstract/wait'

export const textPreview = useAutoResetSignal(() => '', Scope.Act)
export const preview = NonBlocking<{ text: string }>(
    ActScope(() => ({ text }) => {
        textPreview(text)
    })
)

export const showSuffixIconView = useAutoResetSignal(() => false, Scope.Act)
export const suffixIcon = NonBlocking<{ text: string }>(
    ActScope(() => () => {
        showSuffixIconView(true)
    })
)

export const readIndicatorView = useAutoResetSignal(() => false, Scope.Act)

export const textView = useAutoResetSignal(() => '', Scope.Act)
export const text = Dynamic<{ text: string }>(
    ActScope(
        ({ index, timer, store, variables: { global } }) =>
            function* ({ text }) {
                if (global.segment().some((i) => inRange(index, i[0], i[1] + 1))) {
                    readIndicatorView(true)
                } else {
                    global.segment(arrayToInterval([...intervalToArray(global.segment()), index]))
                }

                yield* Y<string, Generator<Promise<void>, void, void>>(
                    (rec) =>
                        function* (str): Generator<Promise<void>, void, void> {
                            yield _wait(timer)(store.config.textspeed * 100)
                            textView((text) => text + str.charAt(0))
                            if (str.length >= 1) yield* rec(str.slice(1))
                        }
                )(text)
            }
    )
)

export const nameView = useAutoResetSignal(() => '', Scope.Act)

export const name = NonBlocking<{ name: string }>(() => ({ name }) => {
    nameView(name)
})
