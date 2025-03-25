import { PromiseX } from '@/utils/PromiseX'

export type Effect<T> = {
    execute: Function0<Promise<void>>
    result: Promise<T>
}

// 分离副作用的实际执行与结果获取
export function splitEffect<T>(executor: Function0<Promise<T>>): Effect<T> {
    const promise = new PromiseX<T>()
    return { execute: () => executor().then(promise.resolve), result: promise }
}
