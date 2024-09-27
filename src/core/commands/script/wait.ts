import { Command, CommandRunFunction } from '@/core/Command'

// 初始化过程中什么都不做
// wait引用系统sleep实现
const wait: CommandRunFunction =
    ({ timer }) =>
    ({ duration }) =>
        timer.delay(duration)

export const Wait: Command = { run: wait }
