import type { NonBlockingCommand } from '../../type'
import { Scope, useAutoResetSignal } from '@/core/useScopeSignal'

export enum EventState {
    Enabled,
    Disabled
}

export const clickState = useAutoResetSignal<EventState>(() => EventState.Enabled, Scope.Game)

export const click: NonBlockingCommand<{ value: boolean }> =
    () =>
    ({ value = true }) => {
        if (value) clickState(EventState.Enabled)
        else clickState(EventState.Disabled)
    }
