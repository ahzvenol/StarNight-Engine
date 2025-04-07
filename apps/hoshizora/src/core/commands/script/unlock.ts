import { NonBlocking } from 'starnight'

declare module 'starnight' {
    interface GameGlobalData {
        unlock: Array<string>
    }
}

// 目前看来解锁的cg和音乐应该很少重复,可以避免书写type
export const unlock = NonBlocking<{ file: string }>(({ global }) => ({ file }) => {
    if (!global.unlock.includes(file)) global.unlock([file, ...global.unlock()])
})
