import type { Reactive } from '@starnight/core'
import { ActScope, Dynamic, NonBlocking, StarNight } from '@starnight/core'

declare module '@starnight/core' {
    interface GameLocalData {
        textpreview?: string
    }
}

export const textpreview = ActScope(
    NonBlocking<string>(({ current }) => (arg0) => {
        current.textpreview(arg0)
    })
)

declare module '@starnight/core' {
    interface GameLocalData {
        namepreview?: string
    }
}

export const namepreview = ActScope(
    NonBlocking<string>(({ current }) => (arg0) => {
        current.namepreview(arg0)
    })
)

declare module '@starnight/core' {
    interface GameUIInternalData {
        iconstate: Reactive<boolean>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.iconstate = StarNight.useReactive(false)
})

StarNight.ActEvents.start.subscribe(({ ui }) => {
    ui.iconstate(false)
})

export const icon = ActScope(
    NonBlocking(({ ui: { iconstate } }) => () => {
        iconstate(true)
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
    Dynamic<string>(
        (context) =>
            function* (arg0) {
                context.ui.text(arg0)
                while (arg0.length >= 1) {
                    yield StarNight.SystemCommands.wait(context.config.textspeed())(context)
                    arg0 = arg0.slice(1)
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
    NonBlocking<string>((context) => (arg0) => {
        context.ui.name(arg0)
    })
)
