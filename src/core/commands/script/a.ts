import type { CommandArgs, StandardCommandFunction } from '@/core/types/Command'
import type { MetaFunction } from '@/core/types/Meta'
import { convert } from '@/core/convert'
import { fork } from '@/core/flow'
import { Flow } from '@/core/types/Flow'
import { commands } from '..'

export interface StandardFlowCommand extends MetaFunction {
    meta: { flow: Flow }
    // @ts-expect-error 类型“CommandArgs[]”不满足约束“CommandArgs”。
    apply: StandardCommandFunction<Array<CommandArgs>>
}

export const Fork: StandardFlowCommand = {
    meta: { flow: Flow.Async },
    apply: (context) => (rows) =>
        fork(
            convert(rows).map((row) => {
                const cmd = commands[row.sign]
                const flow = cmd.meta.flow
                // @ts-expect-error 不能将类型“CommandArgs”分配给类型“never”。
                const apply = () => cmd.apply(context)(row.args)
                return { meta: { flow }, apply }
            })
        )()
}

export const Await: StandardFlowCommand = {
    meta: { flow: Flow.Await },
    apply: (context) => (rows) =>
        fork(
            convert(rows).map((row) => {
                const cmd = commands[row.sign]
                const flow = Flow.Await
                // @ts-expect-error 不能将类型“CommandArgs”分配给类型“never”。
                const apply = () => cmd.apply(context)(row.args)
                return { meta: { flow }, apply }
            })
        )()
}

// export const If: StandardCommand<{ array: Array<CommandArgs> }> = {
//     meta: { flow: Flow.Async },
//     apply:
//         (context) =>
//         ({ array }) => {
//             if (context.variables) {
//                 return par(
//                     convert(array).map((row) => {
//                         const cmd = commands[row.sign]
//                         const flow = cmd.meta.flow
//                         // @ts-expect-error 不能将类型“CommandArgs”分配给类型“never”。
//                         const apply = () => cmd.apply(context)(row.args)
//                         return { meta: { flow }, apply }
//                     })
//                 )()
//             }
//             return Promise.resolve({})
//         }
// }
