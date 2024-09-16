// Promise.withResolvers是2024年的新特性,需要的浏览器版本太高了,目前不用

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

export { PromiseX }