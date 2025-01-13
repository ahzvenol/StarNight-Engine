import { Blocking, NonBlocking } from '@/core/command'
import { PreInitEvent } from '@/core/event'
import { Scope, useAutoResetSignal } from '@/core/utils/useAutoResetSignal'
import { PromiseX } from '@/utils/PromiseX'
import { Jump } from './branch'

type Selection = {
    label: string
    disable: boolean
    select: () => void
}

export const selections = new Array<Selection>()

export const displaySelectionView = useAutoResetSignal(() => false, Scope.Game)

PreInitEvent.subscribe(() => (selections.length = 0))

const promises = new Array<Promise<number>>()

PreInitEvent.subscribe(() => (selections.length = 0))

export const selection = NonBlocking<{ name: string; target: number; disable?: boolean }>(
    () =>
        ({ name, target, disable = false }) => {
            const promise = new PromiseX<number>()
            selections.push({
                label: name,
                disable: disable,
                select: () => promise.resolve(target)
            })
            promises.push(promise)
        }
)

export const selEnd = Blocking(
    (context) =>
        async function () {
            displaySelectionView(true)
            const num = await Promise.race(promises)
            selections.length = 0
            promises.length = 0
            displaySelectionView(false)
            return Jump.apply(context)({ target: num })
        }
)
