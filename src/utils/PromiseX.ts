class PromiseX<T> extends Promise<T> {
    public constructor() {
        super((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })
    }
    public resolve!: Parameters<ConstructorParameters<typeof Promise<T>>[0]>[0]
    public reject!: Parameters<ConstructorParameters<typeof Promise<T>>[0]>[1]
}

export default PromiseX