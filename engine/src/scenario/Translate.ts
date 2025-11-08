/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    StandardBlockingCommand,
    StandardCommand,
    StandardDynamicCommand,
    StandardNonBlockingCommand
} from '@starnight/core'
import type { OptionalKeysOf, RequiredKeysOf, Simplify } from 'type-fest'
import { invert, mapKeys } from 'es-toolkit'

type Rename<T extends Record<PropertyKey, unknown>, M extends Partial<Record<keyof T, PropertyKey>>> =
Simplify<
    {
        [K in (keyof M & RequiredKeysOf<T>) as M[K] extends PropertyKey ? M[K] : never]: T[K]
    } &
    {
        [K in (keyof M & OptionalKeysOf<T>) as M[K] extends PropertyKey ? M[K] : never]?: T[K]
    } & {
        [K in Exclude<keyof T, keyof M>]: T[K]
    }
>

function renameKeys<T extends Record<PropertyKey, unknown>, M extends Partial<Record<keyof T, PropertyKey>>>(
    object: T, keyMap: M
): Rename<T, M> {
    return mapKeys<T, keyof T | Extract<M[keyof M], PropertyKey>>(object, (_, key) => keyMap[key] ?? key) as any
}

/** 为命令的参数提供别名，允许在调用时使用替代参数名。 */
export function Alias<T extends Record<PropertyKey, unknown>, R, M extends Partial<Record<keyof T, PropertyKey>>>(
    fn: StandardDynamicCommand<T, R>, map: M
): StandardDynamicCommand<Rename<T, M>, R>
export function Alias<T extends Record<PropertyKey, unknown>, R, M extends Partial<Record<keyof T, PropertyKey>>>(
    fn: StandardNonBlockingCommand<T, R>, map: M
): StandardNonBlockingCommand<Rename<T, M>, R>
export function Alias<T extends Record<PropertyKey, unknown>, R, M extends Partial<Record<keyof T, PropertyKey>>>(
    fn: StandardBlockingCommand<T, R>, map: M
): StandardBlockingCommand<Rename<T, M>, R>
export function Alias<T extends Record<PropertyKey, unknown>, R, M extends Partial<Record<keyof T, PropertyKey>>>(
    fn: StandardCommand<T, R>, map: M
): StandardCommand<Rename<T, M>, R> {
    // @ts-expect-error 不能将类型...分配给类型...
    const flipmap = invert(map)
    // @ts-expect-error 可赋给 "T" 类型的约束，但可以使用约束 "Record<PropertyKey, unknown>" 的其他子类型实例化 "T"。
    return (args = {}) => fn(renameKeys(args, flipmap))
}

export function MapArgs<T, N, R>(
    fn: StandardBlockingCommand<T, R>, map: (args: N) => T
): StandardBlockingCommand<N, R>
export function MapArgs<T, N, R>(
    fn: StandardNonBlockingCommand<T, R>, map: (args: N) => T
): StandardNonBlockingCommand<N, R>
export function MapArgs<T, N, R>(
    fn: StandardDynamicCommand<T, R>, map: (args: N) => T
): StandardDynamicCommand<N, R>
export function MapArgs<T, N, R>(
    fn: StandardCommand<T, R>, map: (args: N) => T
): StandardCommand<N, R> {
    return (args) => fn(map(args))
}
