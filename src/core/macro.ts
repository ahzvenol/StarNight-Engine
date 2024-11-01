import type { CommandRunFunction, SingalCommand } from './type'
import { State } from './type'

export function toApply<T extends SingalCommand>({
    init,
    run
}: {
    init?: CommandRunFunction<T>
    run: CommandRunFunction<T>
}): CommandRunFunction<T> {
    return (context) => (args) => {
        if (context.state !== State.Init) return run(context)(args)
        else if (init !== undefined) return init(context)(args)
    }
}

export function noInit<T extends SingalCommand>(run: CommandRunFunction<T>): CommandRunFunction<T> {
    return (context) => (args) => {
        if (context.state !== State.Init) return run(context)(args)
    }
}

export function warp<T extends SingalCommand>(
    raw: CommandRunFunction<T>
): Function1<Function1<T, T>, CommandRunFunction<T>> {
    return (warp) => (context) => (args) => raw(context)(warp(args))
}
