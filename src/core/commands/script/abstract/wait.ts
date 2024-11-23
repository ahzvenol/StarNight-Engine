import type { Timer } from '@/core/Timer'
import { TimeoutController } from '@/utils/TimeoutController'

export const _wait = (timer: Timer) => (duration: number) => {
    return new Promise<void>((res) => {
        const controller = new TimeoutController(res, duration)
        timer.addResumeMethod(controller.start)
        timer.addPauseMethod(controller.pause)
        timer.addFinalizeMethod(controller.immediateExecution)
        if (!timer.isPaused) controller.start()
    })
}
