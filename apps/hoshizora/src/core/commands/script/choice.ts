import type { Reactive } from '@starnight/core'
import { Blocking, GameState, NonBlocking, StarNight } from '@starnight/core'
import { PromiseX } from '@/core/PromiseX'
import { SwitchState } from '@/core/SwitchState'
import { Try } from '@/utils/fp/Try'

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

StarNight.GameEvents.setup.subscribe(({ ui, temp }) => {
    temp.choicepointer = -1
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

export const showchoices = Blocking<{ index: number }>(
    (context) =>
        async function ({ index }) {
            const { current, local, global, state, config, ui, temp, output } = context
            const { choices, choicesstate } = ui
            choicesstate(SwitchState.Enabled)
            const history = state.isInitializing() ? local.choicehistory?.[++temp.choicepointer] : undefined
            const target = history ?? (await Promise.race(choices.map((e) => e.promise)))
            const stopfastonchoice = config.stopfastonchoice() && state.isFast()
            Try.apply(() => {
                const achievement = global.achievement
                const i = choices.map((e) => e.target).findIndex((e) => e === target)
                const last = achievement[1 << index]
                if ((last() & (1 << 2)) === 0) {
                    if (state.isFast() || state.isInitializing()) {
                        last(Number((BigInt(last()) & ~BigInt(3)) | BigInt(1 << 2)) + 3)
                    } else {
                        last(Number((BigInt(last()) & ~BigInt(3)) | BigInt(1 << 2)) + i)
                    }
                }
            })
            choicesstate(SwitchState.Disabled)
            current.choicehistory([...(current.choicehistory?.() || []), target])
            StarNight.SystemCommands.jump.apply(context)({ target })
            if (stopfastonchoice) output.state(GameState.Normal)
        }
)
