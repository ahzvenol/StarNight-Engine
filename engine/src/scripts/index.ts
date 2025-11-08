import type { MergeDeep } from 'type-fest'
import { mapValues, merge } from 'es-toolkit'
import * as API from './api'
import * as Macro from './macro'

export const MergedCommands = merge(
    mapValues(API, (value) => mapValues(value, (value) => value)),
    mapValues(Macro, (value) => mapValues(value, (value) => value))
) as MergeDeep<typeof API, typeof Macro>
