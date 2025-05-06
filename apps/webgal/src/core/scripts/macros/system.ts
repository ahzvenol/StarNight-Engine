import { Macro, SystemCommands } from '@starnight/core'
import { State } from '../commands'

// export const wait = Macro<number>(
//     (context) =>
//         async function* (duration) {
//             yield State.click(false)
//             yield State.textbox(false)
//             await SystemCommands.wait(duration)(context)
//             yield State.textbox(true)
//             yield State.click(true)
//         }
// )
