import type { MergeDeep } from 'type-fest'
import type { CommandTagBlocking, CommandTagDynamic, CommandTagNonBlocking } from '@starnight/core'
import { mapValues, merge } from 'es-toolkit'
import * as API from './api'
import * as Macro from './macro'

export const MergedCommands = merge(
    mapValues(API, (value) => mapValues(value, (value) => value)),
    mapValues(Macro, (value) => mapValues(value, (value) => value))
) as MergeDeep<typeof API, typeof Macro>

export type FilterDynamicApis<T> = {
    [K in keyof T as T[K] extends CommandTagDynamic ? K : never]: T[K]
}

export type FilterBlockingApis<T> = {
    [K in keyof T as
    T[K] extends CommandTagBlocking
        ? (T[K] extends CommandTagDynamic | CommandTagNonBlocking ? never : K)
        : never
    ]: T[K]
}

export type FilterNonBlockingApis<T> = {
    [K in keyof T as
    T[K] extends CommandTagNonBlocking
        ? (T[K] extends CommandTagDynamic | CommandTagBlocking ? never : K)
        : never
    ]: T[K]
}
