import type { $async as $$async, $await as $$await } from '@/core/scripts'
import type { $执行 as $$执行, $等待 as $$等待 } from '@/core/scripts/alias'

declare global {
    declare const $async: typeof $$async
    declare const $await: typeof $$await
    declare const $执行: typeof $$执行
    declare const $等待: typeof $$等待
    interface Window {
        $async: typeof $$async
        $await: typeof $$await
        $执行: typeof $$执行
        $等待: typeof $$等待
    }
}
