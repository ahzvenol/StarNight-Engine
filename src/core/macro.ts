import { CommandArgs, CommandRunFunction, State } from './Command'

export function toApply<T extends CommandArgs>({
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

export function noInit<T extends CommandArgs>(run: CommandRunFunction<T>): CommandRunFunction<T> {
    return (context) => (args) => {
        if (context.state !== State.Init) return run(context)(args)
    }
}

export function warp<T extends CommandArgs>(
    raw: CommandRunFunction<T>
): Function1<Function1<T, T>, CommandRunFunction<T>> {
    return (warp) => (context) => (args) => raw(context)(warp(args))
}
