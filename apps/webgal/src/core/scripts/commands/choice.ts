import type { Reactive } from '@starnight/core'
import { Blocking, GameState, NonBlocking, StarNight, SystemCommands } from '@starnight/core'
import { PromiseX } from '@/core/PromiseX'
import { SwitchState } from '@/core/SwitchState'
import { Input } from '.'

declare module '@starnight/core' {
    interface GameConfig {
        stopfastonchoice: boolean
        stopautoonchoice: boolean
    }
    interface GameUIInternalData {
        choices: Array<ChoiceItem>
        choicesstate: Reactive<SwitchState>
    }
}

type ChoiceItem = {
    text: string
    disable: boolean
    target: number | string
    choose: () => void
    promise: Promise<number | string>
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.choicesstate = StarNight.useReactive(SwitchState.Disabled)
})

StarNight.ActEvents.start.subscribe(({ ui }) => {
    ui.choices = []
})

export const add = NonBlocking<{ text: string; target: number | string; disable?: boolean }>(
    ({ ui: { choices } }) =>
        ({ text, target, disable = false }) => {
            const promise = new PromiseX<number | string>()
            choices.push({ text, disable, target, promise, choose: () => promise.resolve(target) })
        }
)

export const end = Blocking((context) => async () => {
    const { state, config, ui, output } = context
    const { choices, choicesstate } = ui
    choicesstate(SwitchState.Enabled)
    const target = await Input.use(Promise.race(choices.map((e) => e.promise)))(context)
    const stopfastonchoice = config.stopfastonchoice() && state.isFast()
    choicesstate(SwitchState.Disabled)
    SystemCommands.jump(target)(context)
    if (stopfastonchoice) output.state(GameState.Normal)
})
