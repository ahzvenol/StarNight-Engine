import { PreInitEvent } from '@/core/event'
import { Blocking, NonBlocking } from '@/core/normalize'
import { displaySelection } from '@/ui/Hoshizora/Game/Selection'
import { PromiseX } from '@/utils/PromiseX'
import { Jump } from './branch'

type Selection = {
    label: string
    disable: boolean
    select: () => void
}

export const selectionView = new Array<Selection>()

PreInitEvent.subscribe(() => (selectionView.length = 0))

const promises = new Array<Promise<number>>()

export const selection = NonBlocking<{ name: string; target: number; disable?: boolean }>(
    () =>
        ({ name, target, disable = false }) => {
            const promise = new PromiseX<number>()
            selectionView.push({
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
            displaySelection(true)
            const num = await Promise.race(promises)
            selectionView.length = 0
            displaySelection(false)
            return Jump.apply(context)({ target: num })
        }
)
