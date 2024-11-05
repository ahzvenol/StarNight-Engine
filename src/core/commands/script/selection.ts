import type { CommandRunFunction } from '@/core/type'
import { showSelection } from '@/ui/Hoshizora/Game/Selection'
import { PromiseX } from '@/utils/PromiseX'
import { useSignal } from '@/utils/Reactive'
import { Jump } from './!'

type Selection = {
    label: string
    disable: boolean
    select: () => void
}

export const selectionView = new Array<Selection>()

const promises = new Array<Promise<number>>()

const beforeInit = () => (selectionView.length = 0)

export const SelHooks = { beforeInit }

// 还不确定的实现,如果分为多个小sel push到数组的话无法主动阻塞，但是这样与整体设计更统一
const selection: CommandRunFunction<{ name: string; target: number; disable?: boolean }> =
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

export const Sel = selection

const build = () => () => {
    showSelection(true)
    return Promise.race(promises).then((num) => {
        selectionView.length = 0
        showSelection(false)
        return Jump()({ target: num })
    })
}

export const SelEnd = build
