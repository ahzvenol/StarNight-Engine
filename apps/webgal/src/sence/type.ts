import type { GameRuntimeContext } from '@starnight/core'
import type { Action } from '@/store/starnight'

export type GameSence<R> = Function1<
    GameRuntimeContext,
    AsyncGenerator<Function1<GameRuntimeContext, Promise<unknown>> | typeof Action, R, GameRuntimeContext>
>
