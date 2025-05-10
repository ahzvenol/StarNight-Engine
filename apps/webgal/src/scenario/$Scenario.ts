import type { GameRuntimeContext } from '@starnight/core'
import type { SimplifyDeep } from 'type-fest'
import { Async, Await } from '@/core/scripts'

export const Action = Symbol()

export { Action as $action }

export let Context = {} as GameRuntimeContext
export const $$context = (ctx: GameRuntimeContext) => (Context = ctx)

export { Context as $context }

// 提取双层函数的参数和最终返回类型，并构造新函数类型
type FlattenFunction<F> = F extends (arg0: infer P0) => (arg: infer P1) => infer R ? (arg0: P0) => Awaited<R> : never

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

export type $Type = SimplifyDeep<CommandPayloads<typeof $async>>
