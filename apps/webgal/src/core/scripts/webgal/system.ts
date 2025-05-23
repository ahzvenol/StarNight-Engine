import { Macro } from '@starnight/core'
import { State, System } from '../api'

export const wait = Macro<number>(
    (context) =>
        async function* (duration) {
            yield State.click(false)
            yield State.textbox(false)
            await System.wait(duration)(context)
            yield State.textbox(true)
            yield State.click(true)
        }
)
