import { useSignal } from '@/utils/Reactive'
import { ActStartEvent, PreInitEvent } from '../event'

export enum Scope {
    Game,
    Act
}

export function useAutoResetSignal<T>(initialValue: Function0<T>, scope: Scope) {
    const signal = useSignal(initialValue())
    if (scope === Scope.Game) PreInitEvent.subscribe(() => signal(() => initialValue()))
    if (scope === Scope.Act) ActStartEvent.subscribe(() => signal(() => initialValue()))
    return signal
}
