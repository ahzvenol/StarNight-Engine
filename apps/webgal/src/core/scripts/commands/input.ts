import type { Reactive } from '@starnight/core'
import { Blocking, StarNight } from '@starnight/core'
import { PromiseX } from '@/core/PromiseX'

declare module '@starnight/core' {
    interface GameLocalData {
        input?: Array<unknown>
    }
    interface GameTempData {
        pointer: number
    }
}

StarNight.GameEvents.setup.subscribe(({ current, temp }) => {
    temp.pointer = -1
    current.input((arr) => arr || [])
})

export const use = Blocking(({ state, current, local, temp }) => async <T>(promise: Promise<T>) => {
    const history = local.input?.[++temp.pointer]
    console.log(state.isInitializing(), history, temp.pointer)
    const input = state.isInitializing() && history ? history : await promise
    current.input((arr) => [...arr!, input])
    return input as T
})

declare module '@starnight/core' {
    interface GameUIInternalData {
        clickinput: Reactive<null | Function0<void>>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.clickinput = StarNight.useReactive(null)
})

export const click = Blocking(({ ui: { clickinput } }) => async () => {
    const promise = new PromiseX<void>()
    clickinput(() => promise.resolve)
    await promise
    clickinput(() => null)
})

declare module '@starnight/core' {
    interface GameUIInternalData {
        textinput: Reactive<null | Function1<string, void>>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.textinput = StarNight.useReactive(null)
})

export const text = Blocking((context) => async () => {
    const {
        ui: { textinput }
    } = context
    const promise = new PromiseX<string>()
    textinput(() => promise.resolve)
    const res = await use(promise)(context)
    textinput(() => null)
    return res
})
