import type { Reactive } from '@/lib/micro-reactive'
import type { Signal } from '@/utils/solid/useSignal'
import { useReactive } from '@/lib/micro-reactive'
import { useSignal } from '@/utils/solid/useSignal'
import { ActStartEvent, GameStartEvent } from '../event'

export function useGameScopeSignal(initialValue: string): Signal<string>
export function useGameScopeSignal(initialValue: number): Signal<number>
export function useGameScopeSignal(initialValue: boolean): Signal<boolean>
export function useGameScopeSignal(initialValue: symbol): Signal<symbol>
export function useGameScopeSignal(initialValue: bigint): Signal<bigint>
export function useGameScopeSignal(initialValue: null): Signal<null>
export function useGameScopeSignal(initialValue: undefined): Signal<undefined>
export function useGameScopeSignal<T extends Primitive>(initialValue: T): Signal<T>
export function useGameScopeSignal<T>(initialValue: T extends Primitive ? T : Function0<T>): Signal<T>
export function useGameScopeSignal<T>(initialValue: T extends Primitive ? T : Function0<T>) {
    const isPrimitive = typeof initialValue !== 'function'
    const signal = useSignal(isPrimitive ? initialValue : initialValue())
    GameStartEvent.subscribe(() => signal(() => (isPrimitive ? initialValue : initialValue())))
    return signal as Signal<T>
}

export function useGameScopeReactive(initialValue: string): Reactive<string>
export function useGameScopeReactive(initialValue: number): Reactive<number>
export function useGameScopeReactive(initialValue: boolean): Reactive<boolean>
export function useGameScopeReactive(initialValue: symbol): Reactive<symbol>
export function useGameScopeReactive(initialValue: bigint): Reactive<bigint>
export function useGameScopeReactive(initialValue: null): Reactive<null>
export function useGameScopeReactive(initialValue: undefined): Reactive<undefined>
export function useGameScopeReactive<T extends Primitive>(initialValue: T): Reactive<T>
export function useGameScopeReactive<T>(initialValue: T extends Primitive ? T : Function0<T>): Reactive<T>
export function useGameScopeReactive<T>(initialValue: T extends Primitive ? T : Function0<T>) {
    const isPrimitive = typeof initialValue !== 'function'
    const signal = useReactive(isPrimitive ? initialValue : initialValue())
    GameStartEvent.subscribe(() => signal(isPrimitive ? initialValue : initialValue()))
    return signal as Reactive<T>
}

export function useActScopeSignal(initialValue: string): Signal<string>
export function useActScopeSignal(initialValue: number): Signal<number>
export function useActScopeSignal(initialValue: boolean): Signal<boolean>
export function useActScopeSignal(initialValue: symbol): Signal<symbol>
export function useActScopeSignal(initialValue: bigint): Signal<bigint>
export function useActScopeSignal(initialValue: null): Signal<null>
export function useActScopeSignal(initialValue: undefined): Signal<undefined>
export function useActScopeSignal<T extends Primitive>(initialValue: T): Signal<T>
export function useActScopeSignal<T>(initialValue: T extends Primitive ? T : Function0<T>): Signal<T>
export function useActScopeSignal<T>(initialValue: T extends Primitive ? T : Function0<T>) {
    const isPrimitive = typeof initialValue !== 'function'
    const signal = useSignal(isPrimitive ? initialValue : initialValue())
    ActStartEvent.subscribe(() => signal(() => (isPrimitive ? initialValue : initialValue())))
    return signal as Signal<T>
}

export function useActScopeReactive(initialValue: string): Reactive<string>
export function useActScopeReactive(initialValue: number): Reactive<number>
export function useActScopeReactive(initialValue: boolean): Reactive<boolean>
export function useActScopeReactive(initialValue: symbol): Reactive<symbol>
export function useActScopeReactive(initialValue: bigint): Reactive<bigint>
export function useActScopeReactive(initialValue: null): Reactive<null>
export function useActScopeReactive(initialValue: undefined): Reactive<undefined>
export function useActScopeReactive<T extends Primitive>(initialValue: T): Reactive<T>
export function useActScopeReactive<T>(initialValue: T extends Primitive ? T : Function0<T>): Reactive<T>
export function useActScopeReactive<T>(initialValue: T extends Primitive ? T : Function0<T>) {
    const isPrimitive = typeof initialValue !== 'function'
    const reactive = useReactive(isPrimitive ? initialValue : initialValue())
    ActStartEvent.subscribe(() => reactive(isPrimitive ? initialValue : initialValue()))
    return reactive as Reactive<T>
}
