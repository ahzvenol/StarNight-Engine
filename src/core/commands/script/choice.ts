import { Blocking, NonBlocking } from '@/core/decorator'
import { GameStartEvent } from '@/core/event'
import { GameState } from '@/core/types/Game'
import { useGameScopeSignal } from '@/core/utils/useScopeSignal'
import { Try } from '@/utils/fp/Try'
import { PromiseX } from '@/utils/PromiseX'
import { Jump } from './system/branch'

type ChoiceItem = {
    text: string
    disable: boolean
    target: number | string
    choose: () => void
}

export let choices = new Array<ChoiceItem>()

export const displaySelectionView = useGameScopeSignal(false)

GameStartEvent.subscribe(() => (choices = []))

let promises = new Array<Promise<number | string>>()

GameStartEvent.subscribe(() => (promises = []))

export const addchoice = NonBlocking<{ text: string; target: number | string; disable?: boolean }>(
    () =>
        ({ text, target, disable = false }) => {
            const promise = new PromiseX<number | string>()
            choices.push({ text, disable, target, choose: () => promise.resolve(target) })
            promises.push(promise)
        }
)

export const showchoices = Blocking<{ index: number }>(
    ({ local, state, store, global }) =>
        async function ({ index }) {
            displaySelectionView(true)
            const savedSelect = local?.select?.shift?.()
            const target = state === GameState.Init && savedSelect ? savedSelect : await Promise.race(promises)
            const stopfastonselection = store.config.stopfastonselection && state === GameState.Fast
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
            displaySelectionView(false)
            choices.length = 0
            promises.length = 0
            selectRecord.push(target)
            return Jump.apply()({ target }).then((jump) =>
                stopfastonselection ? Object.assign(jump, { state: GameState.Normal }) : jump
            )
        }
)
