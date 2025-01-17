import { ActScope, Blocking, NonBlocking } from '@/core/command'
import { PreInitEvent } from '@/core/event'
import { GameState } from '@/core/types/Game'
import { useGameScopeSignal } from '@/core/utils/useScopeSignal'
import { PromiseX } from '@/utils/PromiseX'
import { Jump } from './system/branch'

type Selection = {
    label: string
    disable: boolean
    select: () => void
}

export const selectRecord = Array<number | string>()

PreInitEvent.subscribe(() => (selectRecord.length = 0))

export const selections = new Array<Selection>()

export const displaySelectionView = useGameScopeSignal(false)

PreInitEvent.subscribe(() => (selections.length = 0))

const promises = new Array<Promise<number | string>>()

PreInitEvent.subscribe(() => (promises.length = 0))

export const selection = NonBlocking<{ name: string; target: number | string; disable?: boolean }>(
    ActScope(() => ({ name, target, disable = false }) => {
        const promise = new PromiseX<number | string>()
        selections.push({
            label: name,
            disable: disable,
            select: () => promise.resolve(target)
        })
        promises.push(promise)
    })
)

export const selEnd = Blocking(
    (context) =>
        async function () {
            displaySelectionView(true)
            const target =
                context.state === GameState.Init ? context.initial.select.shift()! : await Promise.race(promises)
            selections.length = 0
            promises.length = 0
            displaySelectionView(false)
            selectRecord.push(target)
            return Jump.apply(context)({ target })
        }
)
