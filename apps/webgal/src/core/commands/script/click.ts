import type { Reactive } from '@starnight/core'
import { DynamicBlocking, NonBlocking, StarNight } from '@starnight/core'
import { PromiseX } from '@/core/PromiseX'
import { SwitchState } from '@/core/SwitchState'

declare module '@starnight/core' {
    interface GameUIInternalData {
        clickstate: Reactive<SwitchState>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.clickstate = StarNight.useReactive(SwitchState.Enabled)
})

export const click = NonBlocking<{ enable: boolean }>(({ ui: { clickstate } }) => ({ enable }) => {
    if (enable) clickstate(SwitchState.Enabled)
    else clickstate(SwitchState.Disabled)
})

declare module '@starnight/core' {
    interface GameUIInternalData {
        check: Reactive<null | Function0<void>>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.check = StarNight.useReactive(null)
})

export const check = DynamicBlocking(
    ({ ui: { check } }) =>
        function* () {
            const promise = new PromiseX<void>()
            check(() => () => promise.resolve())
            yield promise
            check(() => null)
        }
)
