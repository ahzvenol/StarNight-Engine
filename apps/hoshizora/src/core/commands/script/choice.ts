import { Blocking, NonBlocking } from 'starnight'
import { GameState } from 'starnight'
import { SwitchState } from 'starnight'
import { useActScopeSignal, useGameScopeSignal } from 'starnight'
import { Try } from '@/utils/fp/Try'
import { PromiseX } from '@/utils/PromiseX'
import { Jump } from '../system/branch'

type ChoiceItem = {
    text: string
    disable: boolean
    target: number | string
    choose: () => void
}

export const choices = useActScopeSignal<Array<ChoiceItem>>(() => [])

export const UIChoicesState = useActScopeSignal(SwitchState.Disabled)

const promises = useActScopeSignal<Array<Promise<number | string>>>(() => [])

export const addchoice = NonBlocking<{ text: string; target: number | string; disable?: boolean }>(
    () =>
        ({ text, target, disable = false }) => {
            const promise = new PromiseX<number | string>()
            choices().push({
                text,
                disable,
                target,
                choose: () => promise.resolve(target)
            })
            promises().push(promise)
        }
)

declare module 'starnight' {
    interface GameLocalData {
        choice?: Array<number | string>
    }
    interface GameConfig {
        stopfastonselection: boolean
        stopautoonselection: boolean
    }
}

const pointer = useGameScopeSignal(-1)

export const showchoices = Blocking<{ index: number }>(
    ({ current, local, global, state, config }) =>
        async function ({ index }) {
            UIChoicesState(SwitchState.Enabled)
            const history = state === GameState.Init ? local.choice?.[pointer((i) => i + 1)] : undefined
            const target = history ?? (await Promise.race(promises()))
            const stopfastonselection = config.stopfastonselection() && state === GameState.Fast
            Try.apply(() => {
                const achievement = global.achievement
                const i = choices()
                    .map((e) => e.target)
                    .findIndex((e) => e === target)
                const last = achievement[1 << index]
                if ((last() & (1 << 2)) === 0) {
                    if (state === GameState.Fast || state === GameState.Init) {
                        last(Number((BigInt(last()) & ~0b11n) | BigInt(1 << 2)) + 3)
                    } else {
                        last(Number((BigInt(last()) & ~0b11n) | BigInt(1 << 2)) + i)
                    }
                }
            })
            UIChoicesState(SwitchState.Disabled)
            current.choice([...(current.choice?.() || []), target])
            return Jump.apply()({ target }).then((jump) =>
                stopfastonselection ? Object.assign(jump, { state: GameState.Normal }) : jump
            )
        }
)
