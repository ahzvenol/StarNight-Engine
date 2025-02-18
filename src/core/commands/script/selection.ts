import { Blocking, NonBlocking } from '@/core/decorator'
import { PreInitEvent } from '@/core/event'
import { GameState } from '@/core/types/Game'
import { useGameScopeSignal } from '@/core/utils/useScopeSignal'
import { Try } from '@/utils/fp/Try'
import { PromiseX } from '@/utils/PromiseX'
import { Jump } from './system/branch'

type Selection = {
    label: string
    disable: boolean
    target: number | string
    select: () => void
}

export let selectRecord = Array<number | string>()

PreInitEvent.subscribe(() => (selectRecord = []))

export let selections = new Array<Selection>()

export const displaySelectionView = useGameScopeSignal(false)

PreInitEvent.subscribe(() => (selections = []))

let promises = new Array<Promise<number | string>>()

PreInitEvent.subscribe(() => (promises = []))

export const selection = NonBlocking<{ name: string; target: number | string; disable?: boolean }>(
    () =>
        ({ name, target, disable = false }) => {
            const promise = new PromiseX<number | string>()
            selections.push({
                label: name,
                disable: disable,
                target: target,
                select: () => promise.resolve(target)
            })
            promises.push(promise)
        }
)

export const selEnd = Blocking<{ index: number }>(
    ({ initial, state, store, global }) =>
        async function ({ index }) {
            displaySelectionView(true)
            const savedSelect = initial?.select?.shift?.()
            const target = state === GameState.Init && savedSelect ? savedSelect : await Promise.race(promises)
            const stopfastonselection = store.config.stopfastonselection && state === GameState.Fast
            Try.apply(() => {
                const achievement = global.achievement
                const i = selections.map((e) => e.target).findIndex((e) => e === target)
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
            selections.length = 0
            promises.length = 0
            selectRecord.push(target)
            return Jump.apply()({ target }).then((jump) =>
                stopfastonselection ? Object.assign(jump, { state: GameState.Normal }) : jump
            )
        }
)
