import type { CommandTagBlocking, GameRuntimeContext } from '@/index'
import type { Function0, Function1 } from '@/types/Meta'
import { Blocking } from '@/Decorator'
import { StarNight } from '@/index'

declare module '@/index' {
    interface GameLocalData {
        input?: Array<unknown>
    }
    interface GameTempData {
        input: { pointer: number }
    }
}

StarNight.GameEvents.setup.subscribe(({ current, temp }) => {
    temp.input = { pointer: -1 }
    current.input((arr) => arr || [])
})

export const input = Blocking(({ state, current, local, temp }) => async (promise) => {
    const history = local.input?.[++temp.input.pointer]
    const input = state.isInitializing() && history ? history : await promise()
    current.input((arr) => [...arr!, input])
    return input
}) as <T>(arg0: Function0<Promise<T>>) => Function1<GameRuntimeContext, Promise<T>> & CommandTagBlocking
