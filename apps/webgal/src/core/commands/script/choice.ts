import type { Reactive } from '@starnight/core'
import { Blocking, GameState, NonBlocking, StarNight } from '@starnight/core'
import { PromiseX } from '@/core/PromiseX'
import { SwitchState } from '@/core/SwitchState'

declare module '@starnight/core' {
    interface GameLocalData {
        choicehistory?: Array<number | string>
    }
    interface GameConfig {
        stopfastonchoice: boolean
        stopautoonchoice: boolean
    }
    interface GameUIInternalData {
        choices: Array<ChoiceItem>
        choicesstate: Reactive<SwitchState>
    }
    interface GameTempData {
        choicepointer: number
    }
}

type ChoiceItem = {
    text: string
    disable: boolean
    target: number | string
    choose: () => void
    promise: Promise<number | string>
}

StarNight.GameEvents.setup.subscribe(({ current, ui, temp }) => {
    temp.choicepointer = -1
    current.choicehistory((arr) => arr || [])
    ui.choicesstate = StarNight.useReactive(SwitchState.Disabled)
})

StarNight.ActEvents.start.subscribe(({ ui }) => {
    ui.choices = []
})

export const addchoice = NonBlocking<{ text: string; target: number | string; disable?: boolean }>(
    ({ ui: { choices } }) =>
        ({ text, target, disable = false }) => {
            const promise = new PromiseX<number | string>()
            choices.push({ text, disable, target, promise, choose: () => promise.resolve(target) })
        }
)

export const showchoices = Blocking(
    (context) =>
        async function () {
            const { current, local, state, config, ui, temp, output } = context
            const { choices, choicesstate } = ui
            choicesstate(SwitchState.Enabled)
            const history = state.isInitializing() ? local.choicehistory?.[++temp.choicepointer] : undefined
            const target = history ?? (await Promise.race(choices.map((e) => e.promise)))
            const stopfastonchoice = config.stopfastonchoice() && state.isFast()
            choicesstate(SwitchState.Disabled)
            current.choicehistory((arr) => [...arr!, target])
            StarNight.SystemCommands.jump.apply(context)({ target })
            if (stopfastonchoice) output.state(GameState.Normal)
        }
)
