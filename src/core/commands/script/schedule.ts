import type { HighLevelCommandFunction } from '@/core/types/Command'
import type { MetaFunction } from '@/core/types/Meta'
import { convert } from '@/core/convert'
import { Schedule } from '@/core/types/Schedule'
import { commands } from '..'
import { _fork } from './abstract/schedule'

export interface ScheduledHighLevelCommand extends MetaFunction {
    meta: { schedule: Schedule }
    apply: HighLevelCommandFunction
}

export const Fork: ScheduledHighLevelCommand = {
    meta: { schedule: Schedule.Async },
    apply: (context) => (rows) =>
        _fork(
            convert(rows).map((row) => {
                const cmd = commands()[row.key]
                const schedule = cmd.meta.schedule
                const apply = () => cmd.apply(context)(row.args)
                return { meta: { schedule }, apply }
            })
        )()
}

export const Await: ScheduledHighLevelCommand = {
    meta: { schedule: Schedule.Await },
    apply: (context) => async (rows) =>
        _fork(
            convert(rows).map((row) => {
                const cmd = commands()[row.key]
                const schedule = Schedule.Await
                const apply = () => cmd.apply(context)(row.args)
                return { meta: { schedule }, apply }
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
