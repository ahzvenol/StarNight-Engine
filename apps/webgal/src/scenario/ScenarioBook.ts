import type { AbstractGameBook, GameFragment, GameRuntimeContext } from '@starnight/core'
import { $context, Action } from './$Scenario'
import Scenario from './index.scenario'

export type GameScenario<R> = Function1<
    GameRuntimeContext,
    AsyncGenerator<Function1<GameRuntimeContext, Promise<unknown>> | typeof Action, R, GameRuntimeContext>
>

export const book = () =>
    new (class ScenarioBook implements AbstractGameBook {
        scenario = Scenario($context) as ReturnType<GameScenario<unknown>>

        length: Function0<number> = () => Infinity

        act: Function1<number, GameFragment<void>> = () => {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this
            return async function* (ctx: GameRuntimeContext) {
                $context(ctx)
                while (true) {
                    const { value, done } = await self.scenario.next()
                    if (value === Action || done) return
                    else yield value
                }
            }
        }

        label: Function1<string, number> = () => 0
    })()
