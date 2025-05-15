import type { Reactive } from '@starnight/core'
import { ActScope, Dynamic, Macro, NonBlocking, StarNight, SystemCommands } from '@starnight/core'
import { Audio, Backlog, Say } from '.'

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
                    yield SystemCommands.wait(context.config.textspeed())(context)
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

export type SayCommandArgs = { text: string; name?: string; clip?: string }

export const apply = Macro<SayCommandArgs>(
    (context) =>
        async function* ({ text, name, clip }) {
            if (clip !== undefined) yield Audio.set({ type: 'Clip', src: clip })
            yield Say.textpreview(text)
            if (name !== undefined) {
                yield Say.namepreview(name)
                yield Say.name(name)
            }
            yield Backlog.add({ text, name, clip })
            await Say.text(text)(context)
            yield Say.end()
        }
)
