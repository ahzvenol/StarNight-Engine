import { StarNight } from '@/StarNight'
import { ActScope, DynamicBlocking } from '../../Decorator'
import { GameVisibilityEvent } from '../../Events'
import { PromiseX } from '../../utils/PromiseX'
import { TimeoutController } from '../../utils/TimeoutController'

export const wait = ActScope(
    DynamicBlocking<{ duration: number }>(
        ({ onActRush: rush }) =>
            function* ({ duration }) {
                if (duration === 0) return
                const promise = new PromiseX<void>()
                const controller = new TimeoutController(promise.resolve, duration)
                rush.then(() => controller.immediateExecution())
                const id = GameVisibilityEvent.subscribe((visible) =>
                    visible ? controller.start() : controller.pause()
                )
                if (StarNight.isGameVisible()) controller.start()
                yield promise
                GameVisibilityEvent.unsubscribe(id)
            }
    )
)
