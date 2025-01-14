import { Blocking, NonBlocking } from '@/core/command'
import { PreInitEvent } from '@/core/event'
import { GameState } from '@/core/types/Game'
import { Scope, useAutoResetSignal } from '@/core/utils/useAutoResetSignal'
import { PromiseX } from '@/utils/PromiseX'
import { Jump } from '../branch'

// 对于hoshizora来说,读档不需要知道用户选择了什么选项,从零读过去即可

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
    (context) =>
        ({ name, target, disable = false }) => {
            if (context.state === GameState.Init) return
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
            if (context.state === GameState.Init) return
            if (context.state === GameState.Fast && context.store.config.stopfastonselection === false) return
            displaySelectionView(true)
            const num = await Promise.race(promises)
            selections.length = 0
            promises.length = 0
            displaySelectionView(false)
            return Jump.apply(context)({ target: num })
        }
)
