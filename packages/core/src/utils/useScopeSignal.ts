import type { Reactive } from 'micro-reactive-wrapper'
import type { Primitive } from 'type-fest'
import { StarNight } from '@/StarNight'

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
    const signal = StarNight.useReactive(isPrimitive ? initialValue : initialValue())
    StarNight.GameEvents.setup.subscribe(() => signal(() => (isPrimitive ? initialValue : initialValue())))
    return signal as Reactive<T>
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
    const reactive = StarNight.useReactive(isPrimitive ? initialValue : initialValue())
    StarNight.ActEvents.start.subscribe(() => reactive(() => (isPrimitive ? initialValue : initialValue())))
    return reactive as Reactive<T>
}
