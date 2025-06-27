import { ActScope, NonBlocking } from '@starnight/core'

declare module '@starnight/core' {
    interface GameGlobalData {
        unlocked: Array<string>
    }
}

export const unlock = ActScope(
    NonBlocking<string>(
        ({ global }) =>
            (target) => {
                if (!global.unlocked().includes(target)) {
                    global.unlocked([target, ...global.unlocked()])
                }
            }
    )
)

declare module '@starnight/core' {
    interface GameGlobalData {
        achievement: Record<number, boolean>
    }
}

export const achieve = NonBlocking<number>(
    ({ global }) =>
        (index) => {
            if (!global.achievement[index]()) {
                global.achievement[index](true)
            }
        }
)
