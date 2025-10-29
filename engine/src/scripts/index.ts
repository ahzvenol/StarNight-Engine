import type { MergeDeep } from 'type-fest'
import type { CommandTagBlocking, CommandTagNonBlocking } from '@starnight/core'
import { mapValues, merge } from 'es-toolkit'
import * as API from './api'
import * as Macro from './macro'

export const MergedCommands = merge(
    mapValues(API, (value) => mapValues(value, (value) => value)),
    mapValues(Macro, (value) => mapValues(value, (value) => value))
) as MergeDeep<typeof API, typeof Macro>

export type FilterDynamicCommands<T> = {
    [K in keyof T as T[K] extends CommandTagNonBlocking & CommandTagBlocking ? K : never]: T[K]
}

export type FilterBlockingCommands<T> = {
    [K in keyof T as
    T[K] extends CommandTagBlocking
        ? (T[K] extends CommandTagNonBlocking ? never : K)
        : never
    ]: T[K]
}

export type FilterNonBlockingCommands<T> = {
    [K in keyof T as
    T[K] extends CommandTagNonBlocking
        ? (T[K] extends CommandTagBlocking ? never : K)
        : never
    ]: T[K]
}
