import { noInit } from '@/core/macro'
import { CommandRunFunction } from '@/core/type'

// 初始化过程中什么都不做
// wait引用系统sleep实现
const wait: CommandRunFunction<{ duration: number }> =
    ({ timer }) =>
    ({ duration }) =>
        timer.delay(duration)

export const Wait = noInit(wait)
