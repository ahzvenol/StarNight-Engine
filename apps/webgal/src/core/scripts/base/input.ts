import type { CommandTagBlocking, GameRuntimeContext, Reactive } from '@starnight/core'
import { Blocking, DynamicBlocking, GameState, StarNight } from '@starnight/core'
import { PromiseX } from '@/core/PromiseX'
import { System } from '.'

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
            const promise = new PromiseX<void>()
            clickinput(() => promise.resolve)
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
            const promise = new PromiseX<unknown>()
            iframeinput(() => ({ src, resolve: promise.resolve }))
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
            const promise = new PromiseX<string>()
            textinput(
                Object.assign({ resolve: promise.resolve }, args || {}) as TextInput & { resolve: Function1<string, void> }
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
                const promise = new PromiseX<number | string>()
                const resolve = () => promise.resolve(item.id)
                return { ...item, promise, resolve }
            })
            ui.choices(choices)
            const chosen = await System.input(() => Promise.race(choices.map((e) => e.promise)))(context)
            ui.choices(null)
            if (config.stopfastonchoice() && state.isFast()) output.state(GameState.Normal)
            if (config.stopautoonchoice() && state.isAuto()) output.state(GameState.Normal)
            return chosen
        }
) as (<T extends number | string>(arg0: Array<ChoiceItem<T>>) => Function1<GameRuntimeContext, Promise<T>>) & CommandTagBlocking
