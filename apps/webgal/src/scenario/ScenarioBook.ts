import type { AbstractGameBook, GameAct, GameRuntimeContext } from '@starnight/core'
import { Action, Context } from './$Scenario'
// @ts-expect-error 模块没有默认导出。
import Scenario from './index.scenario'

export type GameScenario<R> = Function1<
    GameRuntimeContext,
    AsyncGenerator<Function1<GameRuntimeContext, Promise<unknown>> | typeof Action, R, GameRuntimeContext>
>

export const book = () =>
    new (class ScenarioBook implements AbstractGameBook {
        scenario = Scenario(Context) as ReturnType<GameScenario<unknown>>

        length: Function0<number> = () => Infinity

        act: Function1<number, GameAct<void>> = () => {
            return async function* (this: ScenarioBook, ctx: GameRuntimeContext) {
                Context = ctx
                while (true) {
                    const { value, done } = await this.scenario.next()
                    if (value === Action || done) return
                    else yield value
                }
            }.bind(this)
        }

        label: Function1<string, number> = () => 0
    })()
