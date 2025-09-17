import type { GameRuntimeContext, StandardResolvedCommand, GameScript } from '@starnight/core'
import type { Signal } from 'micro-reactive-solid'
import { useSignal } from 'micro-reactive-solid'

export const $debugger = Symbol()

export type GameScenarioDSL = (
    arg0?: Signal<GameRuntimeContext>
) => Generator<StandardResolvedCommand<unknown> | Promise<unknown> | number | typeof $debugger, unknown, unknown>

export function* ScenarioDSL(DSL: GameScenarioDSL, debug: boolean = false): GameScript {
    let value: unknown
    let done: boolean | undefined
    const ctx = useSignal(null) as unknown as Signal<GameRuntimeContext>
    const scenario = DSL(ctx)

    while (!done) {
        yield function* (context: GameRuntimeContext) {
            ctx(context)
            while (true) {
                const current = scenario.next(value)
                done = current.done
                if (current.done) return NaN
                else if (current.value instanceof Function) {
                    value = yield current.value
                } else if (current.value instanceof Promise) {
                    value = yield current.value
                } else if (debug === true) {
                    if (current.value === $debugger) return (debug = false, NaN)
                } else if (typeof current.value === 'number') return current.value
            }
        }
    }
    return undefined
}
