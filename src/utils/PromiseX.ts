import { noop } from 'es-toolkit'

type PromiseConstructorType<T> = ConstructorParameters<typeof Promise<T>>[0]
type ResolveType<T> = Parameters<PromiseConstructorType<T>>[0]
type RejectType<T> = Parameters<PromiseConstructorType<T>>[1]

class PromiseX<T> extends Promise<T> {
    public constructor(executor: PromiseConstructorType<T> = noop) {
        let resolver!: ResolveType<T>
        let rejector!: RejectType<T>
        super((resolve, reject) => {
            resolver = resolve
            rejector = reject
            // Promise magic: this line is unexplicably essential
            return executor(resolve, reject)
        })
        this.resolve = resolver
        this.reject = rejector
    }
    public resolve!: Parameters<ConstructorParameters<typeof Promise<T>>[0]>[0]
    public reject!: Parameters<ConstructorParameters<typeof Promise<T>>[0]>[1]

    public static status = (p: Promise<unknown>) => {
        const t = {}
        return Promise.race([p, t])
            .then((v) => (v === t ? PromiseState.Pending : PromiseState.Fulfilled))
            .catch(() => PromiseState.Rejected)
    }
}

enum PromiseState {
    Pending,
    Fulfilled,
    Rejected
}

export { PromiseX, PromiseState }
