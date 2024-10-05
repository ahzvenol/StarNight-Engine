import { CommandOutput } from '@/core/Command'
import { merge } from 'es-toolkit'

class Flow<T> {
    constructor(public value: T) {}
}

class Sync<T> extends Flow<T> {
    constructor(value: T) {
        super(value)
    }
}

class Async<T> extends Flow<T> {
    constructor(value: T) {
        super(value)
    }
}

type AsyncTask<T> = Function0<Promise<T>>

type ResolvedCommand = Flow<AsyncTask<CommandOutput>>

// ResolvedCommand应该是应该捕获过的,不然太麻烦了

const par: Function1<Array<ResolvedCommand>, ResolvedCommand> = (array) =>
    new Async(() => Promise.all(array.map((e) => e.value())).then((results) => results.reduce(merge, {})))

const chain: Function1<Array<ResolvedCommand>, ResolvedCommand> = (array) =>
    new Async(() =>
        array.reduce((p, e) => p.then((all) => e.value().then((result) => merge(all, result))), Promise.resolve({}))
    )

const fork: Function1<Array<ResolvedCommand>, ResolvedCommand> = (array) =>
    new Async(async () => {
        const temp = []
        for (const task of array) {
            if (task instanceof Sync) {
                const p = task.value()
                temp.push(p)
                await p
            } else {
                temp.push(task.value())
            }
        }
        return Promise.all(temp).then((results) => results.reduce(merge, {}))
    })
