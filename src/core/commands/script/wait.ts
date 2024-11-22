import { TimeoutController } from '@/utils/TimeoutController'
import { Dynamic } from '../../flow'

// 初始化过程中什么都不做
// wait引用系统sleep实现
export const wait = Dynamic<{ duration: number }>(
    ({ timer }) =>
        function* ({ duration }) {
            yield new Promise<void>((res) => {
                const controller = new TimeoutController(res, duration)
                timer.addResumeMethod(controller.start)
                timer.addPauseMethod(controller.pause)
                timer.addFinalizeMethod(controller.immediateExecution)
                if (!timer.isPaused) controller.start()
            })
        }
)
