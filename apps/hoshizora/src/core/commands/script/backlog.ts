import type { GameLocalData } from '@/core/types/Game'
import { cloneDeep } from 'es-toolkit'
import { unwrap } from 'solid-js/store'
import { NonBlocking } from '@/core/decorator'
import { useGameScopeSignal } from '@/core/utils/useScopeSignal'

export type BacklogCommandArgs = { text: string; name?: string; file?: string }

export type BacklogActData = { local: GameLocalData } & BacklogCommandArgs

export const UIBacklog = useGameScopeSignal<Array<BacklogActData>>(() => [])

declare module '@/core/types/Game' {
    interface GameConfig {
        backlogmaxlength: number
    }
}

export const backlog = NonBlocking<BacklogCommandArgs>(({ current, config }) => ({ text, name, file }) => {
    UIBacklog().unshift({ local: cloneDeep(unwrap(current())), text, name, file })
    if (UIBacklog().length > config.backlogmaxlength()) UIBacklog().pop()
})
