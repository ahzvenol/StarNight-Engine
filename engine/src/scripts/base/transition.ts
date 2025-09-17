import type { Reactive } from '@starnight/core'
import { ActScope, Dynamic, StarNight } from '@starnight/core'
import { System } from '.'

declare module '@starnight/core' {
    interface GameUIInternalData {
        transition: Reactive<TransitionData>
    }
}

const TransitionPersets = { BlindH8: { type: 'BlindH8', duration: 225 } } as const

export type TransitionTypes = keyof typeof TransitionPersets

type TransitionData = { type: TransitionTypes, duration: number } | null

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.transition = StarNight.useReactive(null)
})

export const apply = ActScope(
    Dynamic<TransitionTypes, void>(
        (context) =>
            function* (arg0) {
                const transition = TransitionPersets[arg0]
                context.ui.transition(transition)
                yield System.wait(transition.duration)(context)
                context.ui.transition(null)
            }
    )
)
