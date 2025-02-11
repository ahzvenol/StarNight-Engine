import type { InitialGameData } from '@/core/types/Game'
import { cloneDeep } from 'es-toolkit'
import { NonBlocking } from '@/core/command'
import { getSave } from '@/core/save'
import { GameState } from '@/core/types/Game'
import { useGameScopeSignal } from '@/core/utils/useScopeSignal'

export type BacklogCommandArgs = { text: string; name?: string; file?: string }

export type BacklogActData = { save: InitialGameData } & BacklogCommandArgs

export const backlogView = useGameScopeSignal<Array<BacklogActData>>(() => [])

export const backlog = NonBlocking<BacklogCommandArgs>(
    ({ state, index, initial: { select } }) =>
        ({ text, name, file }) => {
            const save = state === GameState.Init ? { index, select: cloneDeep(select) } : getSave('simple')
            backlogView().unshift({ save, text, name, file })
            if (backlogView().length > 50) backlogView().pop()
        }
)
