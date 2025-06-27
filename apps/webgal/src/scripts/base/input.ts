import type { CommandTagBlocking, GameRuntimeContext, Reactive } from '@starnight/core'
import { Blocking, DynamicBlocking, GameState, StarNight } from '@starnight/core'
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
    click: null | InputResolve<unknown>['resolve']
}

StarNight.GameEvents.setup.subscribe(({ ui: { input } }) => input.click(null))

export const click = DynamicBlocking(
    ({ ui: { input: { click } } }) =>
        function* () {
            const { promise, resolve } = Promise.withResolvers()
            click(() => resolve)
            yield promise
            click(() => null)
        }
)

type IframeInput = { src: string }

interface GameUIInputData {
    iframe: null | (IframeInput & InputResolve<unknown>)
}

StarNight.GameEvents.setup.subscribe(({ ui: { input } }) => input.iframe(null))

export const iframe = Blocking<IframeInput, unknown>(
    (context) =>
        async ({ src }) => {
            const { ui: { input: { iframe } } } = context
            const { promise, resolve } = Promise.withResolvers<unknown>()
            iframe(() => ({ src, resolve }))
            const res = await System.input(() => promise)(context)
            iframe(() => null)
            return res
        }
)

type TextInput = { text: string } | void

interface GameUIInputData {
    text: null | (TextInput & InputResolve<string>)
}

StarNight.GameEvents.setup.subscribe(({ ui: { input } }) => input.text(null))

export const text = Blocking<TextInput, string>(
    (context) =>
        async (args) => {
            const { ui: { input: { text } } } = context
            const { promise, resolve } = Promise.withResolvers<string>()
            text(
                Object.assign({ resolve }, args || {}) as TextInput & { resolve: (value: string) => void }
            )
            const res = await System.input(() => promise)(context)
            text(() => null)
            return res
        }
)

type ChoiceItem<T extends number | string> = { id: T, text: string, disable?: true }

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
        async (arg0) => {
            const { state, config, ui: { input }, output } = context
            const choices = arg0.map((item) => {
                const { promise, resolve } = Promise.withResolvers<number | string>()
                return { ...item, promise, resolve: () => resolve(item.id) }
            })
            input.choices(choices)
            const chosen = await System.input(() => Promise.race(choices.map((e) => e.promise)))(context)
            input.choices(null)
            if (config.stopfastonchoice() && state.isFast()) output.state(GameState.Normal)
            if (config.stopautoonchoice() && state.isAuto()) output.state(GameState.Normal)
            return chosen
        }
) as (<T extends number | string>(arg0: Array<ChoiceItem<T>>) => Function1<GameRuntimeContext, Promise<T>>) & CommandTagBlocking
