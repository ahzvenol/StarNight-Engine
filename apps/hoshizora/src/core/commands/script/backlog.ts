import type { GameLocalData, Reactive } from '@starnight/core'
import { cloneDeep } from 'es-toolkit'
import { NonBlocking, StarNight } from '@starnight/core'

export type BacklogCommandArgs = { text: string; name?: string; file?: string }

export type BacklogActData = { local: GameLocalData } & BacklogCommandArgs

declare module '@starnight/core' {
    interface GameConfig {
        backlogmaxlength: number
    }
    interface GameUIInternalData {
        backlog: Reactive<Array<BacklogActData>>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.backlog = StarNight.useReactive([])
})

export const backlog = NonBlocking<BacklogCommandArgs>(
    ({ current, config, ui: { backlog } }) =>
        ({ text, name, file }) => {
            backlog().unshift({ local: cloneDeep(current()), text, name, file })
            if (backlog().length > config.backlogmaxlength()) backlog().pop()
        }
)
