import type { GameRuntimeContext } from '@starnight/core'
import { Async, Await } from '@/core/scripts'

export const Action = Symbol()

export { Action as $action }

export const Context = {} as GameRuntimeContext

export { Context as $context }

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

export const $await = Await as unknown as FlattenFunctionObject<typeof Await>

export const $async = Async as unknown as FlattenFunctionObject<typeof Async>

// 提取内层函数的第一个参数类型 P1
type ExtractCommandPayloadType<F> = F extends (arg0: infer P1) => unknown ? P1 : never

type CommandPayloads<T> = {
    [K in keyof T]: ExtractCommandPayloadType<T[K]>
}

type DeepExpand<T> = T extends object ? { [K in keyof T]: DeepExpand<T[K]> } : T

export type $Type = DeepExpand<CommandPayloads<typeof $async>>
