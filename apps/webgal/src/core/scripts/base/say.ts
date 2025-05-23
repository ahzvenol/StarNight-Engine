import type { Reactive } from '@starnight/core'
import { ActScope, Dynamic, NonBlocking, StarNight, SystemCommands } from '@starnight/core'

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
        textend: Reactive<boolean>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.textend = StarNight.useReactive(false)
})

StarNight.ActEvents.start.subscribe(({ ui }) => {
    ui.textend(false)
})

export const end = ActScope(
    NonBlocking(({ ui: { textend } }) => () => {
        textend(true)
    })
)

declare module '@starnight/core' {
    interface GameConfig {
        textspeed: number
    }
    interface GameUIInternalData {
        text: HTMLElement
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.text = document.createElement('div')
})

StarNight.ActEvents.start.subscribe(({ ui }) => (ui.text = document.createElement('div')))

export const text = ActScope(
    Dynamic<string | HTMLElement>(
        (context) =>
            function* (arg0) {
                const nodes = arg0 instanceof HTMLElement ? [...arg0.childNodes] : [arg0]
                context.ui.text.append(nodes[0])
                while (nodes.length >= 1) {
                    yield SystemCommands.wait(context.config.textspeed())(context)
                    context.ui.text.append(nodes.shift()!)
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
