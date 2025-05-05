import type { Reactive } from '@starnight/core'
import { DynamicBlocking, StarNight } from '@starnight/core'
import { PromiseX } from '@/core/PromiseX'

declare module '@starnight/core' {
    interface GameUIInternalData {
        clickinput: Reactive<null | Function0<void>>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.clickinput = StarNight.useReactive(null)
})

export const click = DynamicBlocking(
    ({ ui: { clickinput } }) =>
        function* () {
            const promise = new PromiseX<void>()
            clickinput(() => () => promise.resolve())
            yield promise
            clickinput(() => null)
        }
)
