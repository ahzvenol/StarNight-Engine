/* eslint-disable @typescript-eslint/no-unsafe-function-type */

export type Function0<R> = () => R
export type Function1<T1, R> = (arg0: T1) => R
export type Function2<T1, T2, R> = (arg0: T1, arg1: T2) => R
export type Function3<T1, T2, T3, R> = (arg0: T1, arg1: T2, arg2: T3) => R

// 通用类型,表示一个附加了信息的函数
export interface MetaFunction {
    meta?: Record<string, unknown>
    apply: Function
}

// 通用类型,表示永远不会失败的Promise
export type NeverFailingPromise<T> = Promise<T>
