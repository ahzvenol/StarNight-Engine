import { DynamicMacro } from '@starnight/core'
import { Say } from '../api'

export type SayCommandArgs = { text: string, name?: string, clip?: string }

// export const apply = DynamicMacro<SayCommandArgs>(
//     () =>
//         function* ({ text, name, clip }) {
//             yield Say.apply({ text, name: name?.replace(/^\$/, ''), clip: `./static${clip}` })
//         }
// )

export const apply = DynamicMacro<SayCommandArgs>(
    () =>
        function* ({ text, name, clip }) {
            yield Say.apply({ text, name: name?.replace(/^\$/, ''), clip: `./static/AudioClip/${clip}.flac` })
        }
)
