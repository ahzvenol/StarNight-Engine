import type { Accessor, Setter, SignalOptions } from 'solid-js'
import { createSignal } from 'solid-js'

export type Signal<T> = Accessor<T> & Setter<T>
export function useSignal<T>(value: T, options?: SignalOptions<T>): Signal<T> {
    const [get, set] = createSignal(value, options)

    return ((value) => {
        if (value === undefined) return get()
        else return set(value)
    }) as Signal<T>
}
