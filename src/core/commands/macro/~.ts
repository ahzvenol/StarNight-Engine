import { CommandOutput } from '@/core/Command'
import { merge } from 'es-toolkit'
import { match, P } from 'ts-pattern'

export class Flow<T extends Function0<ReturnType<T>>> {
    constructor(private value: T) {}
    public apply = () => this.value()
}

export class Await<T extends Function0<ReturnType<T>>> extends Flow<T> {
    constructor(value: T) {
        super(value)
    }
}

export class Async<T extends Function0<ReturnType<T>>> extends Flow<T> {
    constructor(value: T) {
        super(value)
    }
}

export type AsyncTask<T> = Function0<Promise<T>>

export type ResolvedCommand = AsyncTask<CommandOutput>

export type StandardResolvedCommand = Flow<AsyncTask<CommandOutput>>

// ResolvedCommand应该是应该捕获过的,不然太麻烦了

export const normalize: Function1<Array<ResolvedCommand | StandardResolvedCommand>, Array<StandardResolvedCommand>> = (
    array
) =>
    array.map((e) =>
        match(e)
            .with(P.instanceOf(Flow), (e) => e)
            .with(P.instanceOf(Function), (e) => new Async(e))
            .exhaustive()
    )

export const par: Function1<Array<StandardResolvedCommand>, StandardResolvedCommand> = (array) =>
    new Async(() => Promise.all(array.map((e) => e.apply())).then((results) => results.reduce(merge, {})))

export const chain: Function1<Array<StandardResolvedCommand>, StandardResolvedCommand> = (array) =>
    new Async(() =>
        array.reduce((pre, e) => pre.then((all) => e.apply().then((result) => merge(all, result))), Promise.resolve({}))
    )

export const fork: Function1<Array<StandardResolvedCommand>, StandardResolvedCommand> = (array) =>
    new Async(
        () =>
            array.reduce(
                ([context, pre], e) =>
                    match(e)
                        .with(P.instanceOf(Await), () =>
                            ((currentConext) => [
                                currentConext,
                                pre.then((all) => currentConext.then((result) => merge(all, result)))
                            ])(context.then(() => e.apply()))
                        )
                        .with(P.instanceOf(Async), () => [
                            context,
                            pre.then((all) => context.then(() => e.apply().then((result) => merge(all, result))))
                        ])
                        .exhaustive(),
                [Promise.resolve({}), Promise.resolve({})]
            )[1]
    )
