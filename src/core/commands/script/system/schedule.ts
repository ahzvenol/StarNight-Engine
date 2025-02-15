/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ScheduledHighLevelCommand } from '@/core/types/Command'
import { isUndefined } from 'es-toolkit'
import { Schedule } from '@/core/types/Command'
import { commands } from '../../'
import { _chain, _fork, _par } from '../abstract/schedule'

// meta.key只用于调试

export const Fork: ScheduledHighLevelCommand = {
    meta: { schedule: Schedule.Async },
    apply: (context) => (rows) =>
        _fork(
            rows.flatMap((row) => {
                const cmd = commands()[row.key]
                if (!isUndefined(cmd.meta.exclude) && context.state in cmd.meta.exclude) return []
                const schedule = cmd.meta.schedule || row.block ? Schedule.Await : Schedule.Async
                const apply = () => cmd.apply(context)(row.args as any)
                return [{ meta: { key: row.key, schedule }, apply }]
            })
        )()
}

export const Par: ScheduledHighLevelCommand = {
    meta: { schedule: Schedule.Async },
    apply: (context) => (rows) =>
        _par(
            rows.flatMap((row) => {
                const cmd = commands()[row.key]
                if (!isUndefined(cmd.meta.exclude) && context.state in cmd.meta.exclude) return []
                const schedule = Schedule.Async
                const apply = () => cmd.apply(context)(row.args as any)
                return [{ meta: { key: row.key, schedule }, apply }]
            })
        )()
}

export const Chain: ScheduledHighLevelCommand = {
    meta: { schedule: Schedule.Async },
    apply: (context) => (rows) =>
        _chain(
            rows.flatMap((row) => {
                const cmd = commands()[row.key]
                if (!isUndefined(cmd.meta.exclude) && context.state in cmd.meta.exclude) return []
                const schedule = Schedule.Await
                const apply = () => cmd.apply(context)(row.args as any)
                return [{ meta: { key: row.key, schedule }, apply }]
            })
        )()
}
