import type { Reactive } from '@starnight/core'
import { Blocking, DynamicBlocking, GameState, StarNight } from '@starnight/core'
import { PromiseX } from '@/core/PromiseX'
import { System } from '.'

declare module '@starnight/core' {
    interface GameUIInternalData {
        clickinput: Reactive<null | Function0<void>>
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

declare module '@starnight/core' {
    interface GameUIInternalData {
        textinput: Reactive<null | (TextInput & { resolve: Function1<string, void> })>
    }
}

type TextInput = { text: string } | void

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.textinput = StarNight.useReactive(null)
})

export const text = Blocking<TextInput, string>((context) => async (args) => {
    const { ui: { textinput } } = context
    const promise = new PromiseX<string>()
    textinput(
        Object.assign({ resolve: promise.resolve }, args || {}) as TextInput & { resolve: Function1<string, void> }
    )
    const res = await System.input(() => promise)(context)
    textinput(() => null)
    return res
})

declare module '@starnight/core' {
    interface GameConfig {
        stopfastonchoice: boolean
        stopautoonchoice: boolean
    }
    interface GameUIInternalData {
        choices: Reactive<Array<ChoiceItem & { choose: Function0<void> }> | null>
    }
}

type ChoiceItem = {
    id: number | string
    text: string
    disable?: true
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.choices = StarNight.useReactive(null)
})

export const choose = Blocking<Array<ChoiceItem>, number | string>((context) => async (arr) => {
    const { state, config, ui, output } = context
    const choices = arr.map((item) => {
        const promise = new PromiseX<number | string>()
        const choose = () => promise.resolve(item.id)
        return { ...item, promise, choose }
    })
    ui.choices(choices)
    const chosen = await System.input(() => Promise.race(choices.map((e) => e.promise)))(context)
    ui.choices(null)
    if (config.stopfastonchoice() && state.isFast()) output.state(GameState.Normal)
    if (config.stopautoonchoice() && state.isAuto()) output.state(GameState.Normal)
    return chosen
})
