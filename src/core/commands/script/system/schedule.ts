/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ScheduledHighLevelCommand } from '@/core/types/Schedule'
import { Schedule } from '@/core/types/Schedule'
import { commands } from '../../'
import { _chain, _fork, _par } from '../abstract/schedule'

// meta.key只用于调试

export const Fork: ScheduledHighLevelCommand = {
    meta: { schedule: Schedule.Async },
    apply: (context) => (rows) =>
        _fork(
            rows.map((row) => {
                const cmd = commands()[row.key]
                const schedule = cmd.meta.schedule
                const apply = () => cmd.apply(context)(row.args as any)
                return { meta: { key: row.key, schedule }, apply }
            })
        )()
}

export const Par: ScheduledHighLevelCommand = {
    meta: { schedule: Schedule.Async },
    apply: (context) => (rows) =>
        _par(
            rows.map((row) => {
                const cmd = commands()[row.key]
                const schedule = Schedule.Async
                const apply = () => cmd.apply(context)(row.args as any)
                return { meta: { key: row.key, schedule }, apply }
            })
        )()
}

export const Chain: ScheduledHighLevelCommand = {
    meta: { schedule: Schedule.Async },
    apply: (context) => (rows) =>
        _chain(
            rows.map((row) => {
                const cmd = commands()[row.key]
                const schedule = Schedule.Await
                const apply = () => cmd.apply(context)(row.args as any)
                return { meta: { key: row.key, schedule }, apply }
            })
        )()
}

export const Await: ScheduledHighLevelCommand = {
    meta: { schedule: Schedule.Await },
    apply: (context) => async (rows) =>
        _par(
            rows.map((row) => {
                const cmd = commands()[row.key]
                const schedule = Schedule.Async
                const apply = () => cmd.apply(context)(row.args as any)
                return { meta: { key: row.key, schedule }, apply }
            })
        )()
}

// export const If: StandardCommand<{ array: Array<CommandArgs> }> = {
//     meta: { schedule: Flow.Async },
//     apply:
//         (context) =>
//         ({ array }) => {
//             if (context.variables) {
//                 return par(
//                     convert(array).map((row) => {
//                         const cmd = commands[row.key]
//                         const schedule = cmd.meta.schedule
//                         // @ts-expect-error 不能将类型“CommandArgs”分配给类型“never”。
//                         const apply = () => cmd.apply(context)(row.args)
//                         return { meta: { schedule }, apply }
//                     })
//                 )()
//             }
//             return Promise.resolve({})
//         }
// }
