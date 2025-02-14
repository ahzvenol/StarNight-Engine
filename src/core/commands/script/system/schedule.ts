/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ScheduledHighLevelCommand } from '@/core/types/Schedule'
import { Schedule, Scope } from '@/core/types/Schedule'
import { commands } from '../../'
import { _chain, _fork, _par } from '../abstract/schedule'

// meta.key只用于调试

export const Fork: ScheduledHighLevelCommand = {
    meta: { schedule: Schedule.Async, scope: Scope() },
    apply: (context) => (rows) =>
        _fork(
            rows.flatMap((row) => {
                const cmd = commands()[row.key]
                const schedule = cmd.meta.schedule
                const apply = () => cmd.apply(context)(row.args as any)
                return context.state in cmd.meta.scope ? [{ meta: { key: row.key, schedule }, apply }] : []
            })
        )()
}

export const Par: ScheduledHighLevelCommand = {
    meta: { schedule: Schedule.Async, scope: Scope() },
    apply: (context) => (rows) =>
        _par(
            rows.flatMap((row) => {
                const cmd = commands()[row.key]
                const schedule = Schedule.Async
                const apply = () => cmd.apply(context)(row.args as any)
                return context.state in cmd.meta.scope ? [{ meta: { key: row.key, schedule }, apply }] : []
            })
        )()
}

export const Chain: ScheduledHighLevelCommand = {
    meta: { schedule: Schedule.Async, scope: Scope() },
    apply: (context) => (rows) =>
        _chain(
            rows.flatMap((row) => {
                const cmd = commands()[row.key]
                const schedule = Schedule.Await
                const apply = () => cmd.apply(context)(row.args as any)
                return context.state in cmd.meta.scope ? [{ meta: { key: row.key, schedule }, apply }] : []
            })
        )()
}

export const Await: ScheduledHighLevelCommand = {
    meta: { schedule: Schedule.Await, scope: Scope() },
    apply: (context) => async (rows) => Fork.apply(context)(rows)
}
