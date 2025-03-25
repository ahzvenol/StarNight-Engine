import { ActScope, DynamicBlocking } from '../../Decorator'
import { GameVisibilityEvent } from '../../Event'
import { isGameVisible } from '../../main'
import { PromiseX } from '../../utils/PromiseX'
import { TimeoutController } from '../../utils/TimeoutController'

export const wait = ActScope(
    DynamicBlocking<{ duration: number }>(
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
