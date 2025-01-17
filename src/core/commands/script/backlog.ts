import { NonBlocking } from '@/core/command'
import { useGameScopeSignal } from '@/core/utils/useScopeSignal'

export type BacklogCommandArgs = { text: string; name?: string; file?: string }

export type BacklogActData = { index: number } & BacklogCommandArgs

export const backlogView = useGameScopeSignal<Array<BacklogActData>>(() => [])

export const backlog = NonBlocking<BacklogCommandArgs>(({ index }) => ({ text, name, file }) => {
    backlogView().unshift({ index, text, name, file })
    if (backlogView().length > 50) backlogView().pop()
})
