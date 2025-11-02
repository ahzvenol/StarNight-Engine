import type { CommandTagBlocking } from '../types/Command'
import type { GameRuntimeContext } from '../types/Game'
import { Blocking } from '../Decorator'
import { StarNight } from '../index'

StarNight.GameEvents.setup.subscribe(({ current, local, temp }) => {
    current.input([])
    temp.input = local.input?.values() || [].values()
})

export const input = Blocking(
    ({ state, current, temp }) =>
        async <T>(promise: Function0<Promise<T>>): Promise<T> => {
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

const res = input(async () => '')({} as GameRuntimeContext)

const text = Blocking(
    (context) =>
        async (args?: { text: string }): Promise<string> => {
            const { ui: { input: { text } } } = context
            const { promise, resolve } = Promise.withResolvers<string>()
            text(Object.assign({ resolve }, args))
            const res = await System.input(() => promise)(context)
            text(() => null)
            return res
        }
)
