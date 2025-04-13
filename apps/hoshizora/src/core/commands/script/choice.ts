import type { Reactive } from 'starnight'
import { Blocking, GameState, NonBlocking, StarNight } from 'starnight'
import { PromiseX } from '@/core/PromiseX'
import { SwitchState } from '@/core/SwitchState'
import { Try } from '@/utils/fp/Try'

declare module 'starnight' {
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
    ({ current, local, global, state, config, ui: { choices, choicesstate }, temp }) =>
        async function ({ index }) {
            choicesstate(SwitchState.Enabled)
            const history = state === GameState.Init ? local.choicehistory?.[++temp.choicepointer] : undefined
            const target = history ?? (await Promise.race(choices.map((e) => e.promise)))
            const stopfastonchoice = config.stopfastonchoice() && state === GameState.Fast
            Try.apply(() => {
                const achievement = global.achievement
                const i = choices.map((e) => e.target).findIndex((e) => e === target)
                const last = achievement[1 << index]
                if ((last() & (1 << 2)) === 0) {
                    if (state === GameState.Fast || state === GameState.Init) {
                        last(Number((BigInt(last()) & ~BigInt(3)) | BigInt(1 << 2)) + 3)
                    } else {
                        last(Number((BigInt(last()) & ~BigInt(3)) | BigInt(1 << 2)) + i)
                    }
                }
            })
            choicesstate(SwitchState.Disabled)
            current.choicehistory([...(current.choicehistory?.() || []), target])
            return StarNight.SystemCommands.jump
                .apply()({ target })
                .then((jump) => (stopfastonchoice ? Object.assign(jump, { state: GameState.Normal }) : jump))
        }
)
