/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    CommandTagBlocking,
    CommandTagDynamic,
    CommandTagNonBlocking,
    StandardBlockingCommand,
    StandardCommand,
    StandardDynamicCommand,
    StandardNonBlockingCommand
} from '@starnight/core'
import type { IsAny, IsUnknown } from 'type-fest'
import { mapKeys } from 'es-toolkit'

type IsAnyOrUnknown<T> = IsAny<T> extends true ? true : IsUnknown<T> extends true ? true : false

type ValidMappedKeys<T, M> = {
    [K in keyof M]: K extends keyof T
        ? IsAnyOrUnknown<T[K]> extends true
            ? never
            : M[K] extends PropertyKey
                ? { newKey: M[K], oldKey: K }
                : never
        : never
}[keyof M]

function renameKeys<T extends Record<PropertyKey, unknown>, M extends Partial<Record<keyof T, PropertyKey>>>(
    object: T,
    keyMap: M
): {
    [K in ValidMappedKeys<T, M> as undefined extends T[K['oldKey']] ? never : K['newKey']]: T[K['oldKey']]
} & {
    [K in ValidMappedKeys<T, M> as undefined extends T[K['oldKey']] ? K['newKey'] : never]?: T[K['oldKey']]
} & {
    [K in Exclude<keyof T, keyof M>]: T[K]
} {
    return mapKeys<T, keyof T | Extract<M[keyof M], PropertyKey>>(object, (_, key) => keyMap[key] || key) as any
}

export function flipObject<T extends Record<string | number | symbol, string | number | symbol>>(
    obj: T
): {
        [K in T[keyof T]]: {
            [P in keyof T]: T[P] extends K ? P : never
        }[keyof T]
    } {
    const result: any = {}
    for (const key in obj) {
        const value = obj[key]
        result[value] = key
    }
    return result
}

/** 为命令的参数提供别名，允许在调用时使用替代参数名。 */
export function Alias<T extends Record<PropertyKey, unknown>, R, M extends Partial<Record<keyof T, PropertyKey>>>(
    fn: StandardDynamicCommand<T, R>,
    map: M
): StandardDynamicCommand<
    {
        [K in ValidMappedKeys<T, M> as undefined extends T[K['oldKey']] ? never : K['newKey']]: T[K['oldKey']]
    } & {
        [K in ValidMappedKeys<T, M> as undefined extends T[K['oldKey']] ? K['newKey'] : never]?: T[K['oldKey']]
    } & {
        [K in Exclude<keyof T, keyof M>]: T[K]
    },
    R
>
export function Alias<T extends Record<PropertyKey, unknown>, R, M extends Partial<Record<keyof T, PropertyKey>>>(
    fn: StandardNonBlockingCommand<T, R>,
    map: M
): StandardNonBlockingCommand<
    {
        [K in ValidMappedKeys<T, M> as undefined extends T[K['oldKey']] ? never : K['newKey']]: T[K['oldKey']]
    } & {
        [K in ValidMappedKeys<T, M> as undefined extends T[K['oldKey']] ? K['newKey'] : never]?: T[K['oldKey']]
    } & {
        [K in Exclude<keyof T, keyof M>]: T[K]
    },
    R
>
export function Alias<T extends Record<PropertyKey, unknown>, R, M extends Partial<Record<keyof T, PropertyKey>>>(
    fn: StandardBlockingCommand<T, R>,
    map: M
): StandardBlockingCommand<
    {
        [K in ValidMappedKeys<T, M> as undefined extends T[K['oldKey']] ? never : K['newKey']]: T[K['oldKey']]
    } & {
        [K in ValidMappedKeys<T, M> as undefined extends T[K['oldKey']] ? K['newKey'] : never]?: T[K['oldKey']]
    } & {
        [K in Exclude<keyof T, keyof M>]: T[K]
    },
    R
>
export function Alias<T extends Record<PropertyKey, unknown>, R, M extends Partial<Record<keyof T, PropertyKey>>>(
    fn: StandardCommand<T, R>,
    map: M
): StandardCommand<
    {
        [K in ValidMappedKeys<T, M> as undefined extends T[K['oldKey']] ? never : K['newKey']]: T[K['oldKey']]
    } & {
        [K in ValidMappedKeys<T, M> as undefined extends T[K['oldKey']] ? K['newKey'] : never]?: T[K['oldKey']]
    } & {
        [K in Exclude<keyof T, keyof M>]: T[K]
    },
        R
    > {
    // @ts-expect-error 不能将类型...分配给类型...
    const flipmap = flipObject(map)
    // @ts-expect-error 类型...的参数不能赋给类型“T”的参数。
    return (args) => async (context) => fn(renameKeys(args, flipmap))(context)
}

/** 将命令的类型转换为适用于剧本的形式，这不会改变命令的实际内容 */
export function Api<T, R>(fn: StandardDynamicCommand<T, R>): Function1<T, R> & CommandTagDynamic
export function Api<T, R>(fn: StandardNonBlockingCommand<T, R>): Function1<T, R> & CommandTagNonBlocking
export function Api<T, R>(fn: StandardBlockingCommand<T, R>): Function1<T, R> & CommandTagBlocking
export function Api<T, R>(fn: StandardCommand<T, R>): Function1<T, R> {
    return fn as any
}
