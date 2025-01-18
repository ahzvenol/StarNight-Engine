import { NonBlocking } from '@/core/command'
import { GameState } from '@/core/types/Game'

// 通过更改响应式(或许也可以是非响应式)的变量,在鉴赏页展示对应的cg
// 如果设置为自动解锁,此命令失效
// 在图片放置命令中应该记录使用过的图像
// 或许需要某种方式保证不耦合

// 可以选择此处始终生效,而通过鉴赏页的前置变量&&控制展示
export const unlock = NonBlocking<{ file: string }>(({ state, variables: { global } }) => ({ file }) => {
    if (state === GameState.Init) return
    if (!global.cg.includes(file)) global.cg([file, ...global.cg()])
})
