import { NonBlocking } from '@/core/normalize'
import { Scope, useAutoResetSignal } from '@/core/utils/useScopeSignal'

export type BacklogCommandArgs = { text: string; name?: string; file?: string }

export type BacklogActData = { index: number } & BacklogCommandArgs

export const backlogView = useAutoResetSignal<Array<BacklogActData>>(() => [], Scope.Game)

export const backlog = NonBlocking<BacklogCommandArgs>(({ index }) => ({ text, name, file }) => {
    backlogView().unshift({ index, text, name, file })
    if (backlogView().length > 50) backlogView().pop()
})
