import type { SayCommandArgs } from '../api/say'
import { DynamicMacro } from '@starnight/core'
import { Say } from '../api'

export const apply = DynamicMacro<SayCommandArgs>(
    () =>
        function* ({ text, name, clip }) {
            yield Say.apply({ text, name, ...(clip && { clip: `./static${clip}` }) })
        }
)
