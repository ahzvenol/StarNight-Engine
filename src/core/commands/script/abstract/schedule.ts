import type { ScheduledStandardResolvedCommand, StandardResolvedCommandFunction } from '@/core/types/Schedule'
import { merge, omit } from 'es-toolkit'
import { Schedule } from '@/core/types/Schedule'
import { splitEffect } from '@/core/utils/splitEffect'

// 并行执行接收到全部命令,无论Flow的具体类型
// 完成时间是传入的命令中所需时间最长的那个
export const _par: Function1<Array<ScheduledStandardResolvedCommand>, StandardResolvedCommandFunction> =
    (array) => () =>
        Promise.all(array.map((e) => e.apply())).then((results) => results.reduce(merge, {}))

// 串行执行接收到全部命令,无论Flow的具体类型,行为相当于await cmd1();await cmd2();await cmd3()
// 完成时间是传入的所有命令所需执行时间的和
export const _chain: Function1<Array<ScheduledStandardResolvedCommand>, StandardResolvedCommandFunction> =
    (array) => () =>
        array.reduce((pre, e) => pre.then((all) => e.apply().then((result) => merge(all, result))), Promise.resolve({}))

// 识别Await标识的命令,行为相当于Promise.all(cmd1();await cmd2();cmd3())
// 完成时间是最后一个Await命令执行完毕之后,还在执行的命令,剩余执行时间最长的那个
export const _fork: Function1<Array<ScheduledStandardResolvedCommand>, StandardResolvedCommandFunction> = (array) => {
    return async () => {
        const effects = array.map((e) => ({ ...omit(e, ['apply']), ...splitEffect(e.apply) }))
        for (const effect of effects) {
            if (effect.meta.schedule === Schedule.Await) {
                await effect.execute()
            } else if (effect.meta.schedule === Schedule.Async) {
                effect.execute()
            }
        }
        return Promise.all(effects.map((e) => e.result)).then((results) => results.reduce(merge, {}))
    }
}
