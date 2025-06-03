import type { GameRuntimeContext, StandardResolvedCommand, GameScript } from '@starnight/core'
import type { Signal } from 'micro-reactive-solid'
import { useSignal } from 'micro-reactive-solid'

export type GameScenarioDSL = (
    arg0?: Signal<GameRuntimeContext>
) => AsyncGenerator<StandardResolvedCommand<unknown> | number, unknown, unknown>

export function* ScenarioDSL(DSL: GameScenarioDSL): GameScript {
    let value: Function0<unknown>
    let done: boolean | undefined
    const ctx = useSignal(null) as unknown as Signal<GameRuntimeContext>
    const scenario = DSL(ctx)
    while (!done) {
        yield async function* (context: GameRuntimeContext) {
            ctx(context)
            while (true) {
                const current = await scenario.next(value)
                done = current.done
                if (typeof current.value === 'number') return current.value
                else if (current.done) return NaN
                else value = (yield current.value) as Function0<unknown>
            }
        }
    }
    return undefined
}
