import type { Timer } from '@/core/utils/Timer'
import { TimeoutController } from '@/core/utils/TimeoutController'

export const _wait = (timer: Timer) => (duration: number) => {
    return new Promise<void>((res) => {
        const controller = new TimeoutController(res, duration)
        timer.addResumeMethod(controller.start)
        timer.addPauseMethod(controller.pause)
        // timer.addFinalizeMethod(controller.immediateExecution)
        if (!timer.isPaused) controller.start()
    })
}
