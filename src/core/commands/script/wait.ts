import { isGameVisible } from '@/core/Core'
import { GameVisibilityEvent } from '@/core/event'
import { TimeoutController } from '@/core/utils/TimeoutController'
import { PromiseX } from '@/utils/PromiseX'
import { ActScope, Dynamic } from '../../command'

export const wait = Dynamic<{ duration: number }>(
    'Normal.Await',
    ActScope(
        ({ immediate }) =>
            function* ({ duration }) {
                if (duration === 0) return
                const promise = new PromiseX<void>()
                const controller = new TimeoutController(promise.resolve, duration)
                immediate.then(() => controller.immediateExecution())
                const id = GameVisibilityEvent.subscribe((visible) =>
                    visible ? controller.start() : controller.pause()
                )
                if (isGameVisible()) controller.start()
                yield promise
                GameVisibilityEvent.unsubscribe(id)
            }
    )
)
