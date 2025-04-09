/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    CommandOutput,
    ScheduledHighLevelCommand,
    ScheduledStandardResolvedCommand,
    StandardResolvedCommandFunction
} from '../../types/Command'
import { merge, omit } from 'es-toolkit'
import { StarNight } from '../../StarNight'
import { Schedule } from '../../types/Command'
import { Function1 } from '../../types/Meta'
import { splitEffect } from '../../utils/splitEffect'

const _result: Function1<Array<Promise<CommandOutput>>, Promise<CommandOutput>> = (array) =>
    Promise.all(array).then((results) => results.reduce(merge, {}))

// 并行执行接收到全部命令,无论Flow的具体类型
// 完成时间是传入的命令中所需时间最长的那个
const _par: Function1<Array<ScheduledStandardResolvedCommand>, StandardResolvedCommandFunction> =
    (array) => async () => {
        const effects = array.map((e) => splitEffect(e.apply))
        for (const effect of effects) {
            effect.execute()
        }
        return _result(effects.map((e) => e.result))
    }

// 串行执行接收到全部命令,无论Flow的具体类型
// 完成时间是传入的所有命令所需执行时间的和
const _chain: Function1<Array<ScheduledStandardResolvedCommand>, StandardResolvedCommandFunction> =
    (array) => async () => {
        const effects = array.map((e) => splitEffect(e.apply))
        for (const effect of effects) {
            await effect.execute()
        }
        return _result(effects.map((e) => e.result))
    }

// 根据Flow的具体类型,对Await标识的命令阻塞等待，对Async的命令并行执行
// 完成时间是最后一个Await命令执行完毕之后,还在执行的命令,剩余执行时间最长的那个
const _fork: Function1<Array<ScheduledStandardResolvedCommand>, StandardResolvedCommandFunction> =
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

// meta.key只用于调试

export const fork: ScheduledHighLevelCommand = {
    apply: (context) => async (rows) => {
        const commands = StarNight.commands
        return _fork(
            rows.flatMap((row) => {
                const cmd = commands[row.key]
                if (cmd.meta?.exclude !== undefined && context.state in cmd.meta.exclude) return []
                const schedule = cmd.meta?.schedule || (row.await ? Schedule.Await : Schedule.Async)
                const apply = () => cmd.apply(context)(row.args as any)
                return [{ meta: { key: row.key, schedule }, apply }]
            })
        )()
    }
}

export const par: ScheduledHighLevelCommand = {
    apply: (context) => async (rows) => {
        const commands = StarNight.commands
        return _par(
            rows.flatMap((row) => {
                const cmd = commands[row.key]
                if (cmd.meta?.exclude !== undefined && context.state in cmd.meta.exclude) return []
                const schedule = Schedule.Async
                const apply = () => cmd.apply(context)(row.args as any)
                return [{ meta: { key: row.key, schedule }, apply }]
            })
        )()
    }
}

export const chain: ScheduledHighLevelCommand = {
    apply: (context) => async (rows) => {
        const commands = StarNight.commands
        return _chain(
            rows.flatMap((row) => {
                const cmd = commands[row.key]
                if (cmd.meta?.exclude !== undefined && context.state in cmd.meta.exclude) return []
                const schedule = Schedule.Await
                const apply = () => cmd.apply(context)(row.args as any)
                return [{ meta: { key: row.key, schedule }, apply }]
            })
        )()
    }
}
