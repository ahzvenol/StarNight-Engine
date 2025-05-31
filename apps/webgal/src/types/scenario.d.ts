import type { $async as $$async, $await as $$await } from '@/core/scripts'
import type { $执行 as $$执行, $等待 as $$等待 } from '@/core/scripts/alias'
import type { Store } from '@/store/default'
import type { GameRuntimeContext } from '@starnight/core'

declare global {
    declare const $async: typeof $$async
    declare const $await: typeof $$await
    declare const $执行: typeof $$执行
    declare const $等待: typeof $$等待
    declare const $context: GameRuntimeContext
    declare const $store: Store
    declare const $call: (arg0: string) => void
    interface Window {
        $async: typeof $$async
        $await: typeof $$await
        $执行: typeof $$执行
        $等待: typeof $$等待
        $store: Store
        $call: (arg0: string) => void
        allScenarioModules: Record<string, unknown>
    }
}
