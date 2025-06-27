import type { TransitionTypes } from '../base/transition'
import { DynamicMacro } from '@starnight/core'
import { Transition } from '../base'
import { State } from '.'

export const apply = DynamicMacro<TransitionTypes>(
    (context) =>
        function* (arg0) {
            yield State.ui(false)
            yield Transition.apply(arg0)(context)
            yield State.ui(true)
        }
)
