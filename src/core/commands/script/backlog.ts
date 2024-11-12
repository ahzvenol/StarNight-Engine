import type { NonBlockingCommand } from '../../type'
import { Scope, useAutoResetSignal } from '@/core/useScopeSignal'

export type BacklogCommandArgs = { text: string; name?: string; file?: string }

export type BacklogRowData = { index: number } & BacklogCommandArgs

export const backlogView = useAutoResetSignal<Array<BacklogRowData>>(() => [], Scope.Game)

export const backlog: NonBlockingCommand<BacklogCommandArgs> =
    ({ index }) =>
    ({ text, name, file }) => {
        backlogView().unshift({ index, text, name, file })
        if (backlogView().length > 50) backlogView().pop()
    }
