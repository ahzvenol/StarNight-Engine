import { BlockingMacro } from '@starnight/core'
import { State, System } from '../api'

export const wait = BlockingMacro<number>(
    (context) =>
        async function* (duration) {
            yield State.click(false)
            yield State.box(false)
            await System.wait(duration)(context)
            yield State.box(true)
            yield State.click(true)
        }
)
