import type { TransitionTypes } from '../base/transition'
import { ActScope, DynamicMacro } from '@starnight/core'
import { Transition } from '../base'
import { State } from '.'

export const apply = ActScope(
    DynamicMacro<TransitionTypes>(
        () =>
            function* (arg0) {
                yield State.ui(false)
                yield (yield Transition.apply(arg0))
                yield State.ui(true)
            }
    )
)
