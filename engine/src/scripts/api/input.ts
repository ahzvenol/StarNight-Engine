import type { Reactive } from '@starnight/core'
import { Blocking, GameState, StarNight } from '@starnight/core'
import { System } from './index'

type InputResolve<T> = { resolve: Function1<T, void> }

declare module '@starnight/core' {
    interface GameUIInternalData {
        input: Reactive<GameUIInputData>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.input = StarNight.useReactive({}) as Reactive<GameUIInputData>
})

interface GameUIInputData {
    iframe: null | ({ url: string } & InputResolve<unknown>)
}

StarNight.GameEvents.setup.subscribe(({ ui: { input } }) => input.iframe(null))

export const iframe = Blocking<string, unknown>(
    (context) =>
        async (url) => {
            const { ui: { input: { iframe } } } = context
            const { promise, resolve } = Promise.withResolvers<unknown>()
            iframe(() => ({ url, resolve }))
            const res = await System.input(() => promise)(context)
            iframe(() => null)
            return res
        }
)

interface GameUIInputData {
    text: null | ({ text?: string } & InputResolve<string>)
}

StarNight.GameEvents.setup.subscribe(({ ui: { input } }) => input.text(null))

export const text = Blocking<string | void, string>(
    (context) =>
        async (arg0) => {
            const { ui: { input: { text } } } = context
            const { promise, resolve } = Promise.withResolvers<string>()
            text({ resolve, text: arg0! })
            const res = await System.input(() => promise)(context)
            text(() => null)
            return res
        }
)

type ChoiceItem<T extends number | string> = { label: T, text: string, disable?: true }

declare module '@starnight/core' {
    interface GameConfig {
        stopfastonchoice: boolean
        stopautoonchoice: boolean
    }
}

interface GameUIInputData {
    choices: Array<ChoiceItem<number | string> & InputResolve<void>> | null
}

StarNight.GameEvents.setup.subscribe(({ ui: { input } }) => input.choices(null))

export const choose = Blocking(
    (context) =>
        async <T extends number | string>(arg0: Array<ChoiceItem<T>>): Promise<T> => {
            const { state, config, ui: { input }, output } = context
            const choices = arg0.map((item) => {
                const { promise, resolve } = Promise.withResolvers<number | string>()
                return { ...item, promise, resolve: () => resolve(item.label) }
            })
            input.choices(choices)
            const chosen = await System.input(() => Promise.race(choices.map((e) => e.promise)))(context)
            input.choices(null)
            if (config.stopfastonchoice() && state.isFast()) output.state(GameState.Normal)
            if (config.stopautoonchoice() && state.isAuto()) output.state(GameState.Normal)
            return chosen as T
        }
)
