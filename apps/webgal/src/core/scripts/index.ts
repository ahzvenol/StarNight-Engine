import type { MergeDeep } from 'type-fest'
import type { CommandTagBlocking, CommandTagNonBlocking } from '@starnight/core'
import { mapValues, merge } from 'es-toolkit'
import * as API from './api'
import * as Macro from './macro'

export const MergedCommands = merge(
    mapValues(API, (value) => mapValues(value, (value) => value)),
    mapValues(Macro, (value) => mapValues(value, (value) => value))
) as MergeDeep<typeof API, typeof Macro>

export type FilterBlockingCommands<T> = {
    [K in keyof T as T[K] extends CommandTagBlocking ? K : never]: T[K]
}

export type FilterNonBlockingCommands<T> = {
    [K in keyof T as T[K] extends CommandTagNonBlocking ? K : never]: T[K]
}

export type FlattenCommands<T> = {
    [K in keyof T]: T[K] extends (arg0: infer P0) => (arg1: infer P1) => infer R ? (arg0: P0) => Awaited<R> : never
}
