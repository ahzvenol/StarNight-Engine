import type { CommandTagBlocking, GameRuntimeContext, Reactive } from '@starnight/core'
import { Blocking, DynamicBlocking, GameState, StarNight } from '@starnight/core'
import { System } from './index'

declare module '@starnight/core' {
    interface GameUIInternalData {
        clickinput: Reactive<null | InputResolve<void>['resolve']>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.clickinput = StarNight.useReactive(null)
})

export const click = DynamicBlocking(
    ({ ui: { clickinput } }) =>
        function* () {
            const { promise, resolve } = Promise.withResolvers<void>()
            clickinput(() => resolve)
            yield promise
            clickinput(() => null)
        }
)

type InputResolve<T> = { resolve: Function1<T, void> }

declare module '@starnight/core' {
    interface GameUIInternalData {
        iframeinput: Reactive<null | (IframeInput & InputResolve<unknown>)>
    }
}

type IframeInput = { src: string }

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.iframeinput = StarNight.useReactive(null)
})

export const iframe = Blocking<IframeInput, unknown>(
    (context) =>
        async ({ src }) => {
            const { ui: { iframeinput } } = context
            const { promise, resolve } = Promise.withResolvers<unknown>()
            iframeinput(() => ({ src, resolve }))
            const res = await System.input(() => promise)(context)
            iframeinput(() => null)
            return res
        }
)

declare module '@starnight/core' {
    interface GameUIInternalData {
        textinput: Reactive<null | (TextInput & InputResolve<string>)>
    }
}

type TextInput = { text: string } | void

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.textinput = StarNight.useReactive(null)
})

export const text = Blocking<TextInput, string>(
    (context) =>
        async (args) => {
            const { ui: { textinput } } = context
            const { promise, resolve } = Promise.withResolvers<string>()
            textinput(
                Object.assign({ resolve }, args || {}) as TextInput & { resolve: Function1<string, void> }
            )
            const res = await System.input(() => promise)(context)
            textinput(() => null)
            return res
        }
)

declare module '@starnight/core' {
    interface GameConfig {
        stopfastonchoice: boolean
        stopautoonchoice: boolean
    }
    interface GameUIInternalData {
        choices: Reactive<Array<ChoiceItem<number | string> & InputResolve<void>> | null>
    }
}

type ChoiceItem<T extends number | string> = {
    id: T
    text: string
    disable?: true
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.choices = StarNight.useReactive(null)
})

export const choose = Blocking(
    (context) =>
        async (arg0) => {
            const { state, config, ui, output } = context
            const choices = arg0.map((item) => {
                const { promise, resolve } = Promise.withResolvers<number | string>()
                return { ...item, promise, resolve: () => resolve(item.id) }
            })
            ui.choices(choices)
            const chosen = await System.input(() => Promise.race(choices.map((e) => e.promise)))(context)
            ui.choices(null)
            if (config.stopfastonchoice() && state.isFast()) output.state(GameState.Normal)
            if (config.stopautoonchoice() && state.isAuto()) output.state(GameState.Normal)
            return chosen
        }
) as (<T extends number | string>(arg0: Array<ChoiceItem<T>>) => Function1<GameRuntimeContext, Promise<T>>) & CommandTagBlocking
