import type { DynamicCommand } from '../../type'
import { State } from '../../type'

// 初始化过程中什么都不做
// wait引用系统sleep实现
export const wait: DynamicCommand<{ duration: number }> = ({ state, timer }) =>
    function* ({ duration }) {
        if (state === State.Init) return
        yield timer.delay(duration)
    }
