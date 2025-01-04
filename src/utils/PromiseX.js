import { noop } from 'es-toolkit'

const PromiseState = {
    Pending: 0,
    Fulfilled: 1,
    Rejected: 2
}

class PromiseX extends Promise {
    constructor(executor = noop) {
        let resolver, rejector
        super((resolve, reject) => {
            resolver = resolve
            rejector = reject
            // Promise magic: this line is unexplicably essential
            return executor(resolve, reject)
        })
        this.resolve = resolver
        this.reject = rejector
    }

    static status(p) {
        const t = {}
        return Promise.race([p, t])
            .then((v) => (v === t ? PromiseState.Pending : PromiseState.Fulfilled))
            .catch(() => PromiseState.Rejected)
    }

    static isPending(p) {
        return PromiseX.status(p).then((state) => state === PromiseState.Pending)
    }

    static isSettled(p) {
        return PromiseX.status(p).then((state) => state !== PromiseState.Pending)
    }

    static whenPending(p) {
        return new Promise((res) => PromiseX.isPending(p).then((isPending) => isPending && res()))
    }

    static whenSettled(p) {
        return new Promise((res) => PromiseX.isSettled(p).then((isSettled) => isSettled && res()))
    }
}

export { PromiseX, PromiseState }
