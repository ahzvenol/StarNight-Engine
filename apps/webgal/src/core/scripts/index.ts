import { lowerCase, mapValues, merge } from 'es-toolkit'
import * as Command from './commands'
import * as Macro from './macros'

// 工具类型：合并两个对象类型，B 中的属性覆盖 A 中的同名属性
type Merge<A, B> = {
    [K in keyof A | keyof B]: K extends keyof B ? B[K] : K extends keyof A ? A[K] : never
}

// 工具类型：深入合并两个对象（双层）
type DeepMerge<C, M> = {
    // 遍历 C 和 M 的所有组名 (OuterKey)
    [OuterKey in keyof C | keyof M]: OuterKey extends keyof M // 如果组在 M 中存在
        ? OuterKey extends keyof C // 并且组也在 C 中存在
            ? Merge<C[OuterKey], M[OuterKey]> // 合并 C 和 M 中同名组的内部命令，M 优先
            : M[OuterKey] // 否则，只使用 M 中的组
        : OuterKey extends keyof C // 如果组只在 C 中存在
          ? C[OuterKey] // 使用 C 中的组
          : never // 不应该发生，因为 OuterKey 来自 keyof C | keyof M
}

const Merged = merge(
    mapValues(Command, (value) => mapValues(value, (value) => value)),
    mapValues(Macro, (value) => mapValues(value, (value) => value))
) as DeepMerge<typeof Command, typeof Macro>

export const { Audio, Backlog, Choice, Image, Input, Say, State, System, Var, Video } = Merged

type IsObject<T> = T extends object ? (T extends unknown[] ? false : true) : false

type StringOrNumberKeys<T> = {
    [K in keyof T]: K extends string | number ? K : never
}[keyof T]

type NonObjectKeys<T> = {
    [K in StringOrNumberKeys<T>]: IsObject<T[K]> extends true ? never : K
}[StringOrNumberKeys<T>]

type ObjectKeys<T> = {
    [K in StringOrNumberKeys<T>]: IsObject<T[K]> extends true ? K : never
}[StringOrNumberKeys<T>]

type FlattenNested<P extends string | number, U> = {
    [M in StringOrNumberKeys<U> as `${P extends string ? Lowercase<P> : P}_${M}`]: U[M]
}

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never

type FlattenedNestedUnion<T> = {
    [K in ObjectKeys<T>]: FlattenNested<K, T[K]>
}[ObjectKeys<T>]

type FlattenedNested<T> = UnionToIntersection<FlattenedNestedUnion<T>>

type TopLevelNonObjects<T> = Pick<T, NonObjectKeys<T>>

type FlattenObject<T> = TopLevelNonObjects<T> & FlattenedNested<T>

const $ = Object.entries(Merged)
    .flatMap(([group, value]) =>
        Object.entries(value).map(([key, value]) => ({ [`${lowerCase(group)}_${key}`]: value }))
    )
    .reduce(merge, {}) as FlattenObject<typeof Merged>

// 提取 Promise<T> 的 T
type UnwrapPromise<T> = T extends Promise<infer U> ? U : never

// 提取双层函数的参数和最终返回类型，并构造新函数类型
type FlattenFunction<F> = F extends (arg0: infer P0) => (arg: infer P1) => infer R
    ? (arg0: P0) => UnwrapPromise<R>
    : never

// 处理对象，转换每个函数属性
type FlattenFunctionObject<T> = {
    [K in keyof T]: FlattenFunction<T[K]>
}

export const $await = $ as unknown as FlattenFunctionObject<typeof $>

export const $async = $ as unknown as FlattenFunctionObject<typeof $>
