import type { GameLocalData, Reactive } from '@starnight/core'
import { NonBlocking, StarNight } from '@starnight/core'
import { cloneDeep } from 'es-toolkit'

export type BacklogCommandArgs = { text: string, clip?: string }

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

export const add = NonBlocking<BacklogCommandArgs>(
    ({ local, current, config, ui: { backlog } }) =>
        ({ text, clip }) => {
            if (current.count() <= local.count - config.backlogmaxlength()) return
            backlog().unshift({ local: cloneDeep(current()), text, clip })
            if (backlog().length > config.backlogmaxlength()) backlog().pop()
        }
)
