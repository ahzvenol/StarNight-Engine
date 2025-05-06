import { lowerCase, mapValues, merge } from 'es-toolkit'
import * as Command from './commands'
import * as Macro from './macros'

type MapToKebabCase<T> = {
    [OuterKey in keyof T as OuterKey extends string
        ? keyof T[OuterKey] extends string
            ? Lowercase<`${OuterKey}-${keyof T[OuterKey] & string}`>
            : never
        : never]: T[OuterKey][keyof T[OuterKey]]
}

const Merged = merge(
    mapValues(Command, (value) => mapValues(value, (value) => value)),
    mapValues(Macro, (value) => mapValues(value, (value) => value))
) as typeof Command & typeof Macro

export const { Audio, Backlog, Choice, Image, Input, Say, State, System, Var, Video } = Merged

export const CommandMap = Object.entries(Merged)
    .flatMap(([group, value]) =>
        Object.entries(value).map(([key, value]) => ({ [`${lowerCase(group).split(' ').join('')}-${key}`]: value }))
    )
    .reduce(merge, {}) as unknown as MapToKebabCase<typeof Command & typeof Macro>
