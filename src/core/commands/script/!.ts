import type { CommandArgs, StandardCommand, StandardCommandFunction } from '@/core/types/Command'
import type { MetaFunction } from '@/core/types/Meta'
import { convert } from '@/core/convert'
import { fork, NonBlocking, par } from '@/core/flow'
import { Flow } from '@/core/types/Flow'
import { commands } from '..'
import { _continue, _end, _jump } from './abstract/flow'

export const Continue = NonBlocking(() => () => _continue())

export const Jump = NonBlocking(
    () =>
        ({ target }: { target: number }) =>
            _jump(target)
)

export const End = NonBlocking(() => () => _end())

// const sign = (context) => ({ name }) => jumpMap[name] = index

export interface StandardFlowCommand<T extends CommandArgs = CommandArgs> extends MetaFunction {
    meta: { flow: Flow }
    apply: StandardCommandFunction<T>
}

export const Fork: StandardFlowCommand<{ array: Array<CommandArgs> }> = {
    meta: { flow: Flow.Async },
    apply:
        (context) =>
        ({ array }) =>
            fork(
                convert(array).map((row) => {
                    const cmd = commands[row.sign]
                    const flow = cmd.meta.flow
                    // @ts-expect-error 不能将类型“CommandArgs”分配给类型“never”。
                    const apply = () => cmd.apply(context)(row.args)
                    return { meta: { flow }, apply }
                })
            )()
}

export const If: StandardCommand<{ array: Array<CommandArgs> }> = {
    meta: { flow: Flow.Async },
    apply:
        (context) =>
        ({ array }) => {
            if (context.variables) {
                return par(
                    convert(array).map((row) => {
                        const cmd = commands[row.sign]
                        const flow = cmd.meta.flow
                        // @ts-expect-error 不能将类型“CommandArgs”分配给类型“never”。
                        const apply = () => cmd.apply(context)(row.args)
                        return { meta: { flow }, apply }
                    })
                )()
            }
            return Promise.resolve({})
        }
}

export const Await: StandardCommand<{ array: Array<CommandArgs> }> = {
    meta: { flow: Flow.Await },
    apply:
        (context) =>
        ({ array }) =>
            fork(
                convert(array).map((row) => {
                    const cmd = commands[row.sign]
                    const flow = Flow.Await
                    // @ts-expect-error 不能将类型“CommandArgs”分配给类型“never”。
                    const apply = () => cmd.apply(context)(row.args)
                    return { meta: { flow }, apply }
                })
            )()
}
