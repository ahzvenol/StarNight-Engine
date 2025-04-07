import type { GameLocalData } from 'starnight'
import { cloneDeep } from 'es-toolkit'
import { unwrap } from 'solid-js/store'
import { NonBlocking } from 'starnight'
import { useGameScopeSignal } from 'starnight'

export type BacklogCommandArgs = { text: string; name?: string; file?: string }

export type BacklogActData = { local: GameLocalData } & BacklogCommandArgs

export const UIBacklog = useGameScopeSignal<Array<BacklogActData>>(() => [])

declare module 'starnight' {
    interface GameConfig {
        backlogmaxlength: number
    }
}

export const backlog = NonBlocking<BacklogCommandArgs>(({ current, config }) => ({ text, name, file }) => {
    UIBacklog().unshift({ local: cloneDeep(unwrap(current())), text, name, file })
    if (UIBacklog().length > config.backlogmaxlength()) UIBacklog().pop()
})
