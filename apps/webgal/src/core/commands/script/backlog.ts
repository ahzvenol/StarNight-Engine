import type { GameLocalData, Reactive } from 'starnight'
import { cloneDeep } from 'es-toolkit'
import { NonBlocking, StarNight } from 'starnight'

export type BacklogCommandArgs = { text: string; name?: string; clip?: string }

export type BacklogActData = { local: GameLocalData } & BacklogCommandArgs

declare module 'starnight' {
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
        ({ text, name, clip }) => {
            backlog().unshift({ local: cloneDeep(current()), text, name, clip })
            if (backlog().length > config.backlogmaxlength()) backlog().pop()
        }
)
