import type { CommandTagBlocking } from '../types/Command'
import type { GameRuntimeContext } from '../types/Game'
import { Blocking } from '@/Decorator'
import { StarNight } from '@/index'

StarNight.GameEvents.setup.subscribe(({ current, local, temp }) => {
    current.input([])
    temp.input = local.input?.values() || [].values()
})

export const input = Blocking(({ state, current, temp }) => async (promise) => {
    let input
    if (state.isInitializing()) {
        const res = temp.input.next()
        if (!res.done) input = res.value
        else input = await promise()
    } else input = await promise()
    current.input((arr) => [...arr!, input])
    return input
}) as CommandTagBlocking & (<T>(arg0: Function0<Promise<T>>) => Function1<GameRuntimeContext, Promise<T>>)
