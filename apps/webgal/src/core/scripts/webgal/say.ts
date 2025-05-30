import { DynamicMacro } from '@starnight/core'
import { Say } from '../api'

export type SayCommandArgs = { text: string, name?: string, clip?: string }

export const apply = DynamicMacro<SayCommandArgs>(
    () =>
        function* ({ text, name, clip }) {
            yield Say.apply({ text, name, clip: `./static${clip}` })
        }
)
