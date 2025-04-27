import type { Reactive } from '@starnight/core'
import { ActScope, Dynamic, NonBlocking, StarNight } from '@starnight/core'
import { SwitchState } from '@/core/SwitchState'

declare module '@starnight/core' {
    interface GameLocalData {
        textpreview?: string
    }
}

export const textpreview = ActScope(
    NonBlocking<{ text: string }>(({ current }) => ({ text }) => {
        current.textpreview(text)
    })
)

declare module '@starnight/core' {
    interface GameLocalData {
        namepreview?: string
    }
}

export const namepreview = ActScope(
    NonBlocking<{ text: string }>(({ current }) => ({ text }) => {
        current.namepreview(text)
    })
)

declare module '@starnight/core' {
    interface GameUIInternalData {
        iconstate: Reactive<SwitchState>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.iconstate = StarNight.useReactive(SwitchState.Disabled)
})

StarNight.ActEvents.start.subscribe(({ ui }) => {
    ui.iconstate(SwitchState.Disabled)
})

export const icon = ActScope(
    NonBlocking(({ ui: { iconstate } }) => () => {
        iconstate(SwitchState.Enabled)
    })
)

declare module '@starnight/core' {
    interface GameConfig {
        textspeed: number
    }
    interface GameUIInternalData {
        text: Reactive<string>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.text = StarNight.useReactive('')
})

StarNight.ActEvents.start.subscribe(({ ui }) => ui.text(''))

export const text = ActScope(
    Dynamic<{ text: string }>(
        (context) =>
            function* ({ text }) {
                context.ui.text(text)
                while (text.length >= 1) {
                    yield StarNight.SystemCommands.wait.apply(context)({
                        duration: context.config.textspeed()
                    })
                    text = text.slice(1)
                }
            }
    )
)

declare module '@starnight/core' {
    interface GameUIInternalData {
        name: Reactive<string>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.name = StarNight.useReactive('')
})

StarNight.ActEvents.start.subscribe(({ ui }) => ui.name(''))

export const name = ActScope(
    NonBlocking<{ text: string }>((context) => ({ text }) => {
        context.ui.name(text)
    })
)

declare module '@starnight/core' {
    interface GameUIInternalData {
        textboxstate: Reactive<SwitchState>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.textboxstate = StarNight.useReactive(SwitchState.Enabled)
})

export const textbox = ActScope(
    NonBlocking<{ enable: boolean }>(({ ui: { textboxstate } }) => ({ enable }) => {
        if (enable) textboxstate(SwitchState.Enabled)
        else textboxstate(SwitchState.Disabled)
    })
)
