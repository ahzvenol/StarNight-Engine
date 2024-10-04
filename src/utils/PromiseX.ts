// Promise.withResolvers是2024年的新特性,需要的浏览器版本太高了,目前不用

type PromiseConstructorType<T> = ConstructorParameters<typeof Promise<T>>[0]
type ResolveType<T> = Parameters<PromiseConstructorType<T>>[0]
type RejectType<T> = Parameters<PromiseConstructorType<T>>[1]

class PromiseX<T> extends Promise<T> {
    public constructor(executor: PromiseConstructorType<T> = () => {}) {
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
}

// // 模拟新的?=操作符,这并不好用,唯一的问题是我们无法在外部得知promise的状态,该操作符提供了额外的能力
// // tag:如果Promise.reject(null) 理所当然的会出些问题
// async function questionOp<T>(promise: Promise<T>): Promise<[T | null, unknown | null]> {
//     try {
//         const result = await promise
//         return [result, null]
//     } catch (error) {
//         return [null, error]
//     }
// }

export { PromiseX }
