import { Blocking, NonBlocking } from '@/core/command'
import { PreInitEvent } from '@/core/event'
import { GameState } from '@/core/types/Game'
import { useGameScopeSignal } from '@/core/utils/useScopeSignal'
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

export const selEnd = Blocking(
    (context) =>
        async function () {
            displaySelectionView(true)
            const target =
                context.state === GameState.Init
                    ? context.initial?.select?.shift?.() || (await Promise.race(promises))
                    : await Promise.race(promises)
            const stopfastonselection = context.store.config.stopfastonselection && context.state === GameState.Fast
            displaySelectionView(false)
            selections.length = 0
            promises.length = 0
            selectRecord.push(target)
            return Jump.apply(context)({ target }).then((jump) =>
                stopfastonselection ? Object.assign(jump, { state: GameState.Normal }) : jump
            )
        }
)
