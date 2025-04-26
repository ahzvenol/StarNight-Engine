import type {
    ScheduledHighLevelCommand,
    ScheduledStandardResolvedCommand,
    StandardResolvedCommandFunction
} from '@/types/Command'
import type { Function1 } from '@/types/Meta'
import { StarNight } from '@/StarNight'
import { Schedule } from '@/types/Command'

// 并行执行接收到全部命令,无论Flow的具体类型
// 完成时间是传入的命令中所需时间最长的那个
const _par: Function1<Array<ScheduledStandardResolvedCommand>, StandardResolvedCommandFunction> =
    (array) => async () => {
        await Promise.all(array.map((e) => e.apply()))
    }
// 串行执行接收到全部命令,无论Flow的具体类型
// 完成时间是传入的所有命令所需执行时间的和
const _chain: Function1<Array<ScheduledStandardResolvedCommand>, StandardResolvedCommandFunction> =
    (array) => async () => {
        await array.reduce<Promise<unknown>>((acc, e) => acc.then(e.apply), Promise.resolve())
    }

// 根据Flow的具体类型,对Await标识的命令阻塞等待，对Async的命令并行执行
// 完成时间是最后一个Await命令执行完毕之后,还在执行的命令,剩余执行时间最长的那个
const _fork: Function1<Array<ScheduledStandardResolvedCommand>, StandardResolvedCommandFunction> =
    (array) => async () => {
        const tasks = []
        for (const cmd of array) {
            if (cmd.meta.schedule === Schedule.Await) {
                await cmd.apply()
            } else if (cmd.meta.schedule === Schedule.Async) {
                tasks.push(cmd.apply())
            }
        }
        await Promise.all(tasks)
    }

// meta.key只用于调试

export const fork: ScheduledHighLevelCommand = {
    apply: (context) => async (rows) => {
        const commands = StarNight.Commands
        return _fork(
            rows.flatMap((row) => {
                const cmd = commands[row.key]
                if (cmd.meta?.exclude !== undefined && context.state.now in cmd.meta.exclude) return []
                if (row.condition !== undefined && !row.condition(context)(row.args)) return []
                const schedule = cmd.meta?.schedule || (row.await ? Schedule.Await : Schedule.Async)
                const apply = () => cmd.apply(context)(row.args)
                return [{ meta: { key: row.key, schedule }, apply }]
            })
        )()
    }
}

export const par: ScheduledHighLevelCommand = {
    apply: (context) => async (rows) => {
        const commands = StarNight.Commands
        return _par(
            rows.flatMap((row) => {
                const cmd = commands[row.key]
                if (cmd.meta?.exclude !== undefined && context.state.now in cmd.meta.exclude) return []
                if (row.condition !== undefined && !row.condition(context)(row.args)) return []
                const schedule = Schedule.Async
                const apply = () => cmd.apply(context)(row.args)
                return [{ meta: { key: row.key, schedule }, apply }]
            })
        )()
    }
}

export const chain: ScheduledHighLevelCommand = {
    apply: (context) => async (rows) => {
        const commands = StarNight.Commands
        return _chain(
            rows.flatMap((row) => {
                const cmd = commands[row.key]
                if (cmd.meta?.exclude !== undefined && context.state.now in cmd.meta.exclude) return []
                if (row.condition !== undefined && !row.condition(context)(row.args)) return []
                const schedule = Schedule.Await
                const apply = () => cmd.apply(context)(row.args)
                return [{ meta: { key: row.key, schedule }, apply }]
            })
        )()
    }
}
