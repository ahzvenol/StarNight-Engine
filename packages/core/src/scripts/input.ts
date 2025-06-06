import type { CommandTagBlocking } from '../types/Command'
import type { GameRuntimeContext } from '../types/Game'
import { Blocking } from '@/Decorator'
import { StarNight } from '@/index'

declare module '@/index' {
    interface GameLocalData {
        input: Array<unknown>
    }
    interface GameTempData {
        input: { pointer: number }
    }
}

StarNight.GameEvents.setup.subscribe(({ current, temp }) => {
    current.input([])
    temp.input = { pointer: -1 }
})

export const input = Blocking(({ state, current, local, temp }) => async (promise) => {
    let history: unknown
    if (state.isInitializing() && local.input) {
        temp.input.pointer += 1
        if (temp.input.pointer in local.input) {
            history = local.input[temp.input.pointer]
        }
    }
    const input = state.isInitializing() ? history : await promise()
    current.input((arr) => [...arr!, input])
    return input
}) as CommandTagBlocking & (<T>(arg0: Function0<Promise<T>>) => Function1<GameRuntimeContext, Promise<T>>)
