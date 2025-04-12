import { Blocking, GameState, NonBlocking, Reactive, StarNight, SwitchState } from 'starnight'
import { Try } from '@/utils/fp/Try'
import { PromiseX } from '@/utils/PromiseX'

declare module 'starnight' {
    interface GameLocalData {
        choice?: Array<number | string>
    }
    interface GameConfig {
        stopfastonselection: boolean
        stopautoonselection: boolean
    }
    interface GameUIInternalData {
        choices: Array<ChoiceItem>
        choicesState: Reactive<SwitchState>
    }
    interface GameTempData {
        choicePointer: number
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
    temp.choicePointer = -1
    ui.choicesState = StarNight.useReactive(SwitchState.Disabled)
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
    ({ current, local, global, state, config, ui: { choices, choicesState }, temp }) =>
        async function ({ index }) {
            choicesState(SwitchState.Enabled)
            const history = state === GameState.Init ? local.choice?.[temp.choicePointer++] : undefined
            const target = history ?? (await Promise.race(choices.map((e) => e.promise)))
            const stopfastonselection = config.stopfastonselection() && state === GameState.Fast
            Try.apply(() => {
                const achievement = global.achievement
                const i = choices.map((e) => e.target).findIndex((e) => e === target)
                const last = achievement[1 << index]
                if ((last() & (1 << 2)) === 0) {
                    if (state === GameState.Fast || state === GameState.Init) {
                        last(Number((BigInt(last()) & ~0b11n) | BigInt(1 << 2)) + 3)
                    } else {
                        last(Number((BigInt(last()) & ~0b11n) | BigInt(1 << 2)) + i)
                    }
                }
            })
            choicesState(SwitchState.Disabled)
            current.choice([...(current.choice?.() || []), target])
            return StarNight.SystemCommands.jump
                .apply()({ target })
                .then((jump) => (stopfastonselection ? Object.assign(jump, { state: GameState.Normal }) : jump))
        }
)
