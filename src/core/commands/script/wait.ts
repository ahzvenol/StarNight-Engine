import { isGameVisible } from '@/core/Core'
import { GameVisibilityEvent } from '@/core/event'
import { TimeoutController } from '@/core/utils/TimeoutController'
import { PromiseX } from '@/utils/PromiseX'
import { Dynamic } from '../../command'

export const wait = Dynamic<{ duration: number }>(
    ({ immediate }) =>
        function* ({ duration }) {
            const promise = new PromiseX<void>()
            const controller = new TimeoutController(promise.resolve, duration)
            immediate.then(() => controller.immediateExecution())
            const id = GameVisibilityEvent.subscribe((visible) => (visible ? controller.start() : controller.pause()))
            if (isGameVisible()) controller.start()
            yield promise
            GameVisibilityEvent.unsubscribe(id)
        }
)
