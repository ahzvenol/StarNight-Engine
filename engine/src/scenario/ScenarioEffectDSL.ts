import type { GameScript, GameRuntimeContext } from '@starnight/core'

export type GameScenarioEffectDSL = () => AsyncGenerator<number | typeof $debugger, unknown, unknown>

let GlobalEffectContext!: GameRuntimeContext
const GlobalEffectPromiseList: Array<Promise<unknown>> = []

export function* ScenarioEffect(DSL: GameScenarioEffectDSL, debug: boolean = false): GameScript {
    let value: unknown
    let index: number
    let done: boolean | undefined
    const scenario = DSL()

    while (!done) {
        yield function* (context: GameRuntimeContext) {
            GlobalEffectContext = context
            while (true) {
                const current = (yield scenario.next(value)) as IteratorResult<number | typeof $debugger, unknown>
                done = current.done
                if (current.done) {
                    index = NaN
                    break
                }
                if (debug === true) {
                    if (current.value === $debugger) {
                        index = NaN
                        debug = false
                        break
                    }
                } else if (typeof current.value === 'number') {
                    index = current.value
                    break
                }
            }
            yield Promise.all(GlobalEffectPromiseList)
            GlobalEffectPromiseList.length = 0
            return index
        }
    }
    return undefined
}
