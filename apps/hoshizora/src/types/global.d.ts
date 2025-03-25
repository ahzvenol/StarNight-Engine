// declare const less: any

// type Dictionary<T = any> = Record<string | number, T>

type Function0<R> = () => R
type Function1<T1, R> = (arg0: T1) => R
type Function2<T1, T2, R> = (arg0: T1, arg1: T2) => R
type Function3<T1, T2, T3, R> = (arg0: T1, arg1: T2, arg2: T3) => R

// 定义排除类型：将U从T中剔除, keyof 会取出T与U的所有键, 限定P的取值范围为T中的所有键, 并将其类型设为never
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

// 定义互斥类型，T或U只有一个能出现（互相剔除时，被剔除方必须存在）
type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T)

type Primitive = string | number | boolean | symbol | bigint | null | undefined
