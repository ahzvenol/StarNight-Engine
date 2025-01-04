type PromiseConstructorType<T> = ConstructorParameters<typeof Promise<T>>[0]
type ResolveType<T> = Parameters<PromiseConstructorType<T>>[0]
type RejectType<T> = Parameters<PromiseConstructorType<T>>[1]

declare enum PromiseState {
    Pending = 0,
    Fulfilled = 1,
    Rejected = 2
}

declare class PromiseX<T> extends Promise<T> {
    constructor()

    resolve: ResolveType<T>
    reject: RejectType<T>

    static status(p: Promise<unknown>): Promise<PromiseState>
    static isPending(p: Promise<unknown>): Promise<boolean>
    static isSettled(p: Promise<unknown>): Promise<boolean>
    static whenPending(p: Promise<unknown>): Promise<void>
    static whenSettled(p: Promise<unknown>): Promise<void>
}

export { PromiseX, PromiseState }
