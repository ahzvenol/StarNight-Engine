import type { CommandRunFunction } from '@/core/type'
import { useSignal } from '@/utils/Reactive'

export enum EventState {
    Enabled,
    Disabled
}

export const clickState = useSignal<EventState>(EventState.Enabled)

const click: CommandRunFunction<{ value: boolean }> =
    () =>
    ({ value = true }) => {
        if (value) clickState(EventState.Enabled)
        else clickState(EventState.Disabled)
    }

export const Click = click

export const UserClickHooks = { beforeInit: () => clickState(EventState.Enabled) }
