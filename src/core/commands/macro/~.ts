import { CommandOutput } from '@/core/Command'
import { merge } from 'es-toolkit'
import { match, P } from 'ts-pattern'

class Flow<T extends Function0<ReturnType<T>>> {
    constructor(private value: T) {}
    public apply = () => this.value()
}

class Await<T extends Function0<ReturnType<T>>> extends Flow<T> {
    constructor(value: T) {
        super(value)
    }
}

class Async<T extends Function0<ReturnType<T>>> extends Flow<T> {
    constructor(value: T) {
        super(value)
    }
}

type AsyncTask<T> = Function0<Promise<T>>

type ResolvedCommand = Flow<AsyncTask<CommandOutput>>

// ResolvedCommand应该是应该捕获过的,不然太麻烦了


const par: Function1<Array<ResolvedCommand>, ResolvedCommand> = (array) =>
    new Async(() => Promise.all(array.map((e) => e.apply())).then((results) => results.reduce(merge, {})))

const chain: Function1<Array<ResolvedCommand>, ResolvedCommand> = (array) =>
    new Async(() =>
        array.reduce((pre, e) => pre.then((all) => e.apply().then((result) => merge(all, result))), Promise.resolve({}))
    )

const fork: Function1<Array<ResolvedCommand>, ResolvedCommand> = (array) =>
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
