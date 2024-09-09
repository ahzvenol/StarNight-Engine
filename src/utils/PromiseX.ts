class PromiseX<T> {
    private _resolve!: (value: T | PromiseLike<T>) => void
    private _reject!: (reason?: any) => void
    public promise = new Promise<T>((resolve, reject) => {
        this._resolve = resolve
        this._reject = reject
    })
    public constructor() { }
    public resolve = (value: T | PromiseLike<T>) => {
        this._resolve(value)
    }
    public reject = (reason?: any) => {
        this._reject(reason)
    }
}

export default PromiseX