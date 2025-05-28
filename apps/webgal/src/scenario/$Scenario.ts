import type { SimplifyDeep } from 'type-fest'
import { Asyncable, Awaitable } from '@/core/scripts'

// 提取双层函数的参数和最终返回类型，并构造新函数类型
type FlattenFunction<F> = F extends (arg0: infer P0) => (arg1: infer P1) => infer R ? (arg0: P0) => Awaited<R> : never

// 处理对象，转换每个函数属性
type FlattenFunctionObject<T> = {
    [K in keyof T]: FlattenFunction<T[K]>
}

export const $await = Awaitable as unknown as FlattenFunctionObject<typeof Awaitable>

export const $async = Asyncable as unknown as FlattenFunctionObject<typeof Asyncable>

// 提取内层函数的第一个参数类型 P1
type ExtractCommandPayloadType<F> = F extends (arg0: infer P1) => unknown ? P1 : never

type CommandPayloads<T> = {
    [K in keyof T]: ExtractCommandPayloadType<T[K]>
}

export type $Type = SimplifyDeep<CommandPayloads<typeof $async>>
