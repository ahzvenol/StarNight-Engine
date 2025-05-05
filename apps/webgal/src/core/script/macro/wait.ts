import { Macro, StarNight } from '@starnight/core'
import { State } from '../command'

export const wait = Macro<number>(
    (context) =>
        async function* (duration) {
            yield State.click(false)
            yield State.textbox(false)
            await StarNight.SystemCommands.wait(duration)(context)
            yield State.textbox(true)
            yield State.click(true)
        }
)
