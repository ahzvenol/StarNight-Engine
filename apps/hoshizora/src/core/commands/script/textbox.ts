import type { Reactive } from 'starnight'
import { ActScope, Dynamic, NonBlocking, StarNight } from 'starnight'
import { SwitchState } from '@/core/SwitchState'

declare module 'starnight' {
    interface GameLocalData {
        textpreview?: string
    }
}

export const textpreview = ActScope(
    NonBlocking<{ text: string }>(({ current }) => ({ text }) => {
        current.textpreview(text)
    })
)

declare module 'starnight' {
    interface GameUIInternalData {
        iconState: Reactive<SwitchState>
    }
}

StarNight.GameEvents.start.subscribe(({ ui }) => {
    ui.iconState = StarNight.useReactive(SwitchState.Disabled)
})

StarNight.ActEvents.start.subscribe(({ ui }) => {
    ui.iconState(SwitchState.Disabled)
})

export const icon = ActScope(
    NonBlocking(({ ui: { iconState } }) => () => {
        iconState(SwitchState.Enabled)
    })
)

declare module 'starnight' {
    interface GameConfig {
        textspeed: number
    }
    interface GameUIInternalData {
        text: Reactive<string>
    }
}

StarNight.GameEvents.start.subscribe(({ ui }) => {
    ui.text = StarNight.useReactive('')
})

StarNight.ActEvents.start.subscribe(({ ui }) => ui.text(''))

export const text = ActScope(
    Dynamic<{ text: string }>(
        (context) =>
            function* ({ text }) {
                while (text.length >= 1) {
                    yield StarNight.SystemCommands.wait.apply(context)({
                        duration: context.config.textspeed()
                    })
                    context.ui.text((i) => i + text.charAt(0))
                    text = text.slice(1)
                }
            }
    )
)

// 类型声明（已包含在 GameUIInternalData 中）
declare module 'starnight' {
    interface GameUIInternalData {
        name: Reactive<string>
    }
}

StarNight.GameEvents.start.subscribe(({ ui }) => {
    ui.name = StarNight.useReactive('')
})

StarNight.ActEvents.start.subscribe(({ ui }) => ui.name(''))

export const name = ActScope(
    NonBlocking<{ name: string }>((context) => ({ name }) => {
        context.ui.name(name)
    })
)

declare module 'starnight' {
    interface GameUIInternalData {
        textboxState: Reactive<SwitchState>
    }
}

StarNight.GameEvents.start.subscribe(({ ui }) => {
    ui.textboxState = StarNight.useReactive(SwitchState.Enabled)
})

StarNight.ActEvents.start.subscribe(({ ui }) => ui.textboxState(SwitchState.Enabled))

export const textbox = ActScope(
    NonBlocking<{ enable: boolean }>(({ ui: { textboxState } }) => ({ enable }) => {
        if (enable) textboxState(SwitchState.Enabled)
        else textboxState(SwitchState.Disabled)
    })
)
