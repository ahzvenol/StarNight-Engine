import type { EffectFunction, EffectOptions } from 'solid-js'
import { createEffect, createRoot, onCleanup } from 'solid-js'

// 可以主动解除监听的createEffect
export function useEffect<Next>(fn: EffectFunction<undefined | NoInfer<Next>, Next>): () => void
export function useEffect<Next, Init = Next>(
    fn: EffectFunction<Init | Next, Next>,
    value: Init,
    options?: EffectOptions & {
        render?: boolean
    }
): () => void
export function useEffect(
    fn: EffectFunction<unknown, unknown>,
    value?: unknown,
    options?: EffectOptions & {
        render?: boolean
    }
) {
    const dispose = createRoot((dispose) => {
        createEffect(fn, value, options)
        return dispose
    })

    onCleanup(() => dispose())
    return dispose
}
