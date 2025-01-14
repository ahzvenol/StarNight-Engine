import type { GameRuntimeContext } from '@/core/types/Game'
import { isGameVisible } from '@/core/Core'
import { GameVisibilityEvent } from '@/core/event'
import { TimeoutController } from '@/core/utils/TimeoutController'
import { PromiseX } from '@/utils/PromiseX'

export const _wait = ({ immediate }: GameRuntimeContext) =>
    function* (duration: number) {
        const promise = new PromiseX<void>()
        const controller = new TimeoutController(promise.resolve, duration)
        immediate.then(() => controller.immediateExecution())
        const id = GameVisibilityEvent.subscribe((visible) => (visible ? controller.start() : controller.pause()))
        if (isGameVisible()) controller.start()
        yield promise
        GameVisibilityEvent.unsubscribe(id)
    }
