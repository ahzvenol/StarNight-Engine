import { Blocking } from '../Decorator'
import { StarNight } from '../index'

StarNight.GameEvents.setup.subscribe(({ current, local, temp }) => {
    current.input([])
    temp.input = local.input?.values() || [].values()
})

export const input = Blocking(
    ({ state, current, temp }) =>
        async <T>(promise: () => Promise<T>): Promise<T> => {
            let input
            if (state.isInitializing()) {
                const res = temp.input.next()
                if (!res.done) input = res.value
                else input = await promise()
            } else input = await promise()
            current.input((arr) => [...arr!, input])
            return input as T
        }
)
