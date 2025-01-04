import type { CommandOutput } from '@/core/types/Command'
import type { ScheduledStandardResolvedCommand, StandardResolvedCommandFunction } from '@/core/types/Schedule'
import { merge, omit } from 'es-toolkit'
import { Schedule } from '@/core/types/Schedule'
import { splitEffect } from '@/core/utils/splitEffect'

// 并行执行接收到全部命令,无论Flow的具体类型
// 完成时间是传入的命令中所需时间最长的那个
export const _par: Function1<Array<ScheduledStandardResolvedCommand>, StandardResolvedCommandFunction> =
    (array) => () => {
        const effects = array.map((e) => splitEffect(e.apply))
        for (const effect of effects) {
            effect.execute()
        }
        return _result(effects.map((e) => e.result))
    }

// 串行执行接收到全部命令,无论Flow的具体类型
// 完成时间是传入的所有命令所需执行时间的和
export const _chain: Function1<Array<ScheduledStandardResolvedCommand>, StandardResolvedCommandFunction> =
    (array) => async () => {
        const effects = array.map((e) => splitEffect(e.apply))
        for (const effect of effects) {
            await effect.execute()
        }
        return _result(effects.map((e) => e.result))
    }

// 根据Flow的具体类型,对Await标识的命令阻塞等待，对Async的命令并行执行
// 完成时间是最后一个Await命令执行完毕之后,还在执行的命令,剩余执行时间最长的那个
export const _fork: Function1<Array<ScheduledStandardResolvedCommand>, StandardResolvedCommandFunction> =
    (array) => async () => {
        const effects = array.map((e) => ({ ...omit(e, ['apply']), ...splitEffect(e.apply) }))
        for (const effect of effects) {
            if (effect.meta.schedule === Schedule.Await) {
                await effect.execute()
            } else if (effect.meta.schedule === Schedule.Async) {
                effect.execute()
            }
        }
        return _result(effects.map((e) => e.result))
    }

export const _result: Function1<Array<Promise<CommandOutput>>, Promise<CommandOutput>> = (array) =>
    Promise.all(array).then((results) => results.reduce(merge, {}))
