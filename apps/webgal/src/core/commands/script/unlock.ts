import { NonBlocking } from '@starnight/core'

declare module '@starnight/core' {
    interface GameGlobalData {
        unlock: Array<string>
    }
}

// 目前看来解锁的cg和音乐应该很少重复,可以避免书写type
export const unlock = NonBlocking<{ target: string }>(({ global }) => ({ target }) => {
    if (!global.unlock().includes(target)) global.unlock([target, ...global.unlock()])
})
