import type { Asyncable, Awaitable } from '@/core/scripts'
import type { 并行命令, 阻塞命令 } from '@/core/scripts/alias'

declare global {
    declare const $await: FlattenFunctionObject<typeof Awaitable>
    declare const $async: FlattenFunctionObject<typeof Asyncable>
    declare const $等待 = 阻塞命令 as unknown as FlattenFunctionObject<typeof 阻塞命令>
    declare const $执行 = 并行命令 as unknown as FlattenFunctionObject<typeof 并行命令>
    interface Window {
        $await: FlattenFunctionObject<typeof Awaitable>
        $async: FlattenFunctionObject<typeof Asyncable>
        $等待: FlattenFunctionObject<typeof 阻塞命令>
        $执行: FlattenFunctionObject<typeof 并行命令>
    }
}
