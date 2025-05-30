import type { CommandTagBlocking, CommandTagNonBlocking } from '@starnight/core'
import type { Except, MergeDeep, UnionToIntersection } from 'type-fest'
import { lowerCase, mapValues, merge } from 'es-toolkit'
import * as API from './api'
import * as Macro from './webgal'

export const MergedCommands = merge(
    mapValues(API, (value) => mapValues(value, (value) => value)),
    mapValues(Macro, (value) => mapValues(value, (value) => value))
) as MergeDeep<typeof API, typeof Macro>

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

type FlattenedNestedUnion<T> = {
    [K in ObjectKeys<T>]: FlattenNested<K, T[K]>
}[ObjectKeys<T>]

type FlattenedNested<T> = UnionToIntersection<FlattenedNestedUnion<T>>

type TopLevelNonObjects<T> = Pick<T, NonObjectKeys<T>>

type FlattenObject<T> = TopLevelNonObjects<T> & FlattenedNested<T>

export const FlattenCommands = Object.entries(MergedCommands)
    .flatMap(([group, value]) =>
        Object.entries(value).map(([key, value]) => ({ [`${lowerCase(group)}_${key}`]: value }))
    )
    .reduce(merge, {}) as FlattenObject<Except<typeof MergedCommands, 'Say'>>

type Filter<T, Tag> = {
    [K in keyof T as T[K] extends Tag ? K : never]: T[K]
}

export const Awaitable = FlattenCommands as Filter<typeof FlattenCommands, CommandTagBlocking>

export const Asyncable = FlattenCommands as Filter<typeof FlattenCommands, CommandTagNonBlocking>

// 提取双层函数的参数和最终返回类型，并构造新函数类型
type FlattenFunction<F> = F extends (arg0: infer P0) => (arg1: infer P1) => infer R ? (arg0: P0) => Awaited<R> : never

// 处理对象，转换每个函数属性
type FlattenFunctionObject<T> = {
    [K in keyof T]: FlattenFunction<T[K]>
}

export const $await = Awaitable as unknown as FlattenFunctionObject<typeof Awaitable>

export const $async = Asyncable as unknown as FlattenFunctionObject<typeof Asyncable>
