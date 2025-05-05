import type { GameBook } from './Book'
import type { Reactive } from './StarNight'
import type { CommandArgs } from './types/Command'
import type { GameActProcessed, GameRuntimeContext } from './types/Game'
import type { Function0, Function1 } from './types/Meta'
import { StarNight } from './StarNight'

const Action = Symbol()
const ForkStart = Symbol()
const ForkEnd = Symbol()

type Script = Function1<
    GameRuntimeContext,
    AsyncGenerator<Function1<GameRuntimeContext, Promise<unknown>> | typeof ActionSeparator, void, GameRuntimeContext>
>
type Fork = Function0<AsyncGenerator<Function1<GameRuntimeContext, Promise<unknown>>, void, GameRuntimeContext>>

const Context = StarNight.useReactive({}) as Reactive<GameRuntimeContext>

function fork(fn: Fork): Function1<GameRuntimeContext, Promise<unknown>> {
    return async (context: GameRuntimeContext) => {
        const generator = fn()
        const arr = Array<Promise<unknown>>()
        while (true) {
            const { value, done } = await generator.next(context)
            if (done) return Promise.all(arr)
            else arr.push(value!(context))
        }
    }
}

declare const Commands: Record<string, Function1<CommandArgs, Function1<GameRuntimeContext, Promise<unknown>>>>

function CodeGen(raw: GameBook): Script {
    return async function* (context) {
        for (let i = 0; i < raw.length(); i++) {
            yield* (async function* rec(act: GameActProcessed): ReturnType<Fork> {
                for (const row of act) {
                    if (row.await) await Commands[row.key](row.args)(context)
                    else if (row.key === 'fork') yield fork(() => rec(row.args))
                    else yield Commands[row.key](row.args)
                }
            })(raw.act(i))
            context = yield ActionSeparator
        }
    }
}

class ScriptRunner {
    done = false
    constructor(public script: ReturnType<Script>) {}

    async next(): Promise<unknown> {
        return fork(
            async function* (this: ScriptRunner) {
                while (true) {
                    const { value, done } = await this.script.next()
                    if (done !== undefined) this.done = done
                    if (value === ActionSeparator || done) return
                    else yield value
                }
            }.bind(this)
        )(Context())
    }
}
