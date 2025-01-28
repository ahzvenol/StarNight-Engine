import { ActScope, Blocking, NonBlocking } from '@/core/command'
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
            target: target,
            select: () => promise.resolve(target)
        })
        promises.push(promise)
    })
)

export const selEnd = Blocking<{ index: number }>(
    (context) =>
        async function ({ index }) {
            displaySelectionView(true)
            const stop = context.store.config.stopfastonselection
            const target =
                context.state === GameState.Init
                    ? context.initial.select.shift()!
                    : context.state === GameState.Fast && !stop
                      ? selections[0].target
                      : await Promise.race(promises)

            Try.apply(() => {
                const achievement = context.variables.global.achievement
                const i = selections.map((e) => e.target).findIndex((e) => e === target)
                const last = achievement[1 << index]
                if ((last() & (1 << 2)) === 0) {
                    if (!stop) {
                        last(Number((BigInt(last()) & ~0b11n) | BigInt(1 << 2)) + 3)
                    } else {
                        last(Number((BigInt(last()) & ~0b11n) | BigInt(1 << 2)) + i)
                    }
                    console.log(last())
                    console.log(context.variables.global.achievement())
                }
            })
            displaySelectionView(false)
            selections.length = 0
            promises.length = 0
            selectRecord.push(target)
            return Jump.apply(context)({ target }).then((jump) =>
                stop && context.state === GameState.Fast ? Object.assign(jump, { state: GameState.Normal }) : jump
            )
        }
)
