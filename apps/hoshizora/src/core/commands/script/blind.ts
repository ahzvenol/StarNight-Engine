import { ActScope, DynamicBlocking, Reactive, StarNight, SwitchState } from 'starnight'

declare module 'starnight' {
    interface GameUIInternalData {
        blindState: Reactive<SwitchState>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.blindState = StarNight.useReactive(SwitchState.Disabled)
})

StarNight.ActEvents.start.subscribe(({ ui }) => {
    ui.blindState(SwitchState.Disabled)
})

export const blind = ActScope(
    DynamicBlocking(
        (context) =>
            function* () {
                context.ui.blindState(SwitchState.Enabled)
                yield StarNight.SystemCommands.wait.apply(context)({ duration: 300 })
                context.ui.blindState(SwitchState.Disabled)
            }
    )
)
