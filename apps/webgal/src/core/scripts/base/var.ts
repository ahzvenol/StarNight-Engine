import { NonBlocking } from '@starnight/core'

declare module '@starnight/core' {
    interface GameGlobalData {
        unlock: Array<string>
    }
}

// 目前看来解锁的名称应该很少重复,可以共用同一个数组记录
export const unlock = NonBlocking<string>(({ global }) => (target) => {
    if (!global.unlock().includes(target)) global.unlock([target, ...global.unlock()])
})

declare module '@starnight/core' {
    interface GameGlobalData {
        achievement: Record<number, boolean>
    }
}

export const achievement = NonBlocking<number>(({ global }) => (index) => {
    if (!global.achievement[index]()) {
        global.achievement[index](true)
    }
})
