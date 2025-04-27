import type { Reactive } from '@starnight/core'
import { ActScope, DynamicBlocking, StarNight } from '@starnight/core'
import { SwitchState } from '@/core/SwitchState'

declare module '@starnight/core' {
    interface GameUIInternalData {
        blindstate: Reactive<SwitchState>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.blindstate = StarNight.useReactive(SwitchState.Disabled)
})

StarNight.ActEvents.start.subscribe(({ ui }) => {
    ui.blindstate(SwitchState.Disabled)
})

export const blind = ActScope(
    DynamicBlocking(
        (context) =>
            function* () {
                context.ui.blindstate(SwitchState.Enabled)
                yield StarNight.SystemCommands.wait.apply(context)({ duration: 300 })
                context.ui.blindstate(SwitchState.Disabled)
            }
    )
)
