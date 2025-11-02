import type { CommandTagBlocking, StandardBlockingCommand } from '../types/Command'
import type { GameRuntimeContext } from '../types/Game'
import { Blocking } from '../Decorator'
import { StarNight } from '../index'

StarNight.GameEvents.setup.subscribe(({ current, local, temp }) => {
    current.input([])
    temp.input = local.input?.values() || [].values()
})

const Tag = <T>(fn: T): T & CommandTagBlocking => fn

export const input =
// Tag(
    Blocking(
        ({ state, current, temp }) =>
            async <T>(promise: () => Promise<T>): Promise<T> => {
                let input
                if (state.isInitializing()) {
                    const res = temp.input.next()
                    if (!res.done) input = res.value
                    else input = await promise()
                } else input = await promise()
                current.input((arr) => [...arr!, input])
                return input as T
            }
    )
// )
const tagged = Tag(input)

const res = input(async () => '')({} as GameRuntimeContext)

const text = Blocking(
    (context) =>
        async (args?: { text: string }): Promise<string> => ''
)

const abc = Blocking<string, string>(
    (context) =>
        async (args) => ''
)
