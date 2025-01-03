import { noop } from 'es-toolkit'

type PromiseConstructorType<T> = ConstructorParameters<typeof Promise<T>>[0]
type ResolveType<T> = Parameters<PromiseConstructorType<T>>[0]
type RejectType<T> = Parameters<PromiseConstructorType<T>>[1]

class PromiseX<T> extends Promise<T> {
    public constructor(executor: never = noop as unknown as never) {
        let resolver!: ResolveType<T>
        let rejector!: RejectType<T>
        super((resolve, reject) => {
            resolver = resolve
            rejector = reject
            // Promise magic: this line is unexplicably essential
            // @ts-expect-error 类型 "never" 没有调用签名。
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

    public static isPending = (p: Promise<unknown>) => {
        return new Promise<boolean>((res) =>
            this.status(p).then((state) => (state === PromiseState.Pending ? res(true) : res(false)))
        )
    }

    public static isSettled = (p: Promise<unknown>) => {
        return new Promise<boolean>((res) =>
            this.status(p).then((state) => (state !== PromiseState.Pending ? res(true) : res(false)))
        )
    }

    public static whenPending = (p: Promise<unknown>) => {
        return new Promise<void>((res) => this.isPending(p).then((isPending) => isPending && res()))
    }

    public static whenSettled = (p: Promise<unknown>) => {
        return new Promise<void>((res) => this.isSettled(p).then((isSettled) => isSettled && res()))
    }
}

enum PromiseState {
    Pending,
    Fulfilled,
    Rejected
}

export { PromiseX, PromiseState }
