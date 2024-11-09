import type { CommandRunFunction } from '@/core/type'
import { Scope, useAutoResetSignal } from '@/core/useScopeSignal'

type BacklogCommandArgs = { text: string; name?: string; file?: string }

type BacklogRowData = { index: number } & BacklogCommandArgs

export const backlogView = useAutoResetSignal<Array<BacklogRowData>>(() => [], Scope.Game)

const backlog: CommandRunFunction<BacklogCommandArgs> =
    ({ index }) =>
    ({ text, name, file }) => {
        backlogView().unshift({ index, text, name, file })
        if (backlogView().length > 50) backlogView().pop()
    }

export const Backlog = backlog
