import { noop } from 'es-toolkit'

type PromiseConstructorType<T> = ConstructorParameters<typeof Promise<T>>[0]
type ResolveType<T> = Parameters<PromiseConstructorType<T>>[0]
type RejectType<T> = Parameters<PromiseConstructorType<T>>[1]

export enum PromiseState {
    Pending,
    Fulfilled,
    Rejected
}

export class PromiseX<T> extends Promise<T> {
    public resolve!: ResolveType<T>
    public reject!: RejectType<T>
    public constructor(executor: void = noop as unknown as void) {
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

    public static isFulfilled = (p: Promise<unknown>) => {
        return new Promise<boolean>((res) =>
            this.status(p).then((state) => (state === PromiseState.Fulfilled ? res(true) : res(false)))
        )
    }

    public static isRejected = (p: Promise<unknown>) => {
        return new Promise<boolean>((res) =>
            this.status(p).then((state) => (state === PromiseState.Rejected ? res(true) : res(false)))
        )
    }

    public static isSettled = (p: Promise<unknown>) => {
        return new Promise<boolean>((res) =>
            this.status(p).then((state) => (state !== PromiseState.Pending ? res(true) : res(false)))
        )
    }
}
