import { DynamicBlocking } from '../Decorator'
import { PromiseX } from '../utils/PromiseX'
import { TimeoutController } from '../utils/TimeoutController'

export const wait = DynamicBlocking<number>(
    ({ state, onActRush, instance: { isGameVisible, GameEvents } }) =>
        function* (duration) {
            if (duration === 0 || state.isInitializing()) return
            const promise = new PromiseX<void>()
            const controller = new TimeoutController(promise.resolve, duration)
            onActRush.then(() => controller.rush())
            const listener = (visible: boolean) => {
                if (visible) controller.start()
                else controller.pause()
            }
            GameEvents.active.subscribe(listener)
            if (isGameVisible()) controller.start()
            yield promise
            GameEvents.active.unsubscribe(listener)
        }
)
