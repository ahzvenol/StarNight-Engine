import type { CommandRunFunction } from '@/core/type'
import { Scope, useAutoResetSignal } from '@/core/useScopeSignal'

export enum EventState {
    Enabled,
    Disabled
}

export const clickState = useAutoResetSignal<EventState>(() => EventState.Enabled, Scope.Game)

const click: CommandRunFunction<{ value: boolean }> =
    () =>
    ({ value = true }) => {
        if (value) clickState(EventState.Enabled)
        else clickState(EventState.Disabled)
    }

export const Click = click
