import { ActScope, DynamicBlocking } from '../Decorator'
import { PromiseX } from '../utils/PromiseX'
import { TimeoutController } from '../utils/TimeoutController'

export const wait = ActScope(
    DynamicBlocking<number>(
        ({ onActRush, instance: { isGameVisible, GameEvents } }) =>
            function* (duration) {
                if (duration === 0) return
                const promise = new PromiseX<void>()
                const controller = new TimeoutController(promise.resolve, duration)
                onActRush.then(() => controller.rush())
                const id = GameEvents.active.subscribe((visible) => (visible ? controller.start() : controller.pause()))
                if (isGameVisible()) controller.start()
                yield promise
                GameEvents.active.unsubscribe(id)
            }
    )
)
