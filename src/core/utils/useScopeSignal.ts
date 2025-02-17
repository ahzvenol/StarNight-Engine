import type { Signal } from '@/utils/solid/useSignal'
import { useSignal } from '@/utils/solid/useSignal'
import { ActStartEvent, GameMountEvent } from '../event'

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
    GameMountEvent.subscribe(() => signal(() => (isPrimitive ? initialValue : initialValue())))
    return signal as Signal<T>
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
