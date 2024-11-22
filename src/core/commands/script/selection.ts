import type { BlockingCommand, Command, NonBlockingCommand } from '../../type'
import { PreInitEvent } from '@/core/event'
import { Blocking, NonBlocking } from '@/core/flow'
import { displaySelection } from '@/ui/Hoshizora/Game/Selection'
import { PromiseX } from '@/utils/PromiseX'
import { Jump } from './!'

type Selection = {
    label: string
    disable: boolean
    select: () => void
}

export const selectionView = new Array<Selection>()

PreInitEvent.subscribe(() => (selectionView.length = 0))

const promises = new Array<Promise<number>>()

// 还不确定的实现,如果分为多个小sel push到数组的话无法主动阻塞，但是这样与整体设计更统一
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
    () =>
        async function () {
            displaySelection(true)
            const num = await Promise.race(promises)
            selectionView.length = 0
            displaySelection(false)
            return Jump.apply()({ target: num })
        }
)
