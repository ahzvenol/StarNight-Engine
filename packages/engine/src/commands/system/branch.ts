import type { CommandArgs, StandardCommand0 } from '../../types/Command'
import { NonBlocking, VirtualScope } from '../../Decorator'

export const cont = NonBlocking(() => () => ({ continue: true })) as StandardCommand0<CommandArgs>

export const jump = NonBlocking(() => async ({ target }) => ({ jump: target, continue: true })) as StandardCommand0<{
    target: number | string
}>

export const end = NonBlocking(() => () => ({ end: true })) as StandardCommand0<CommandArgs>

export const label = VirtualScope(NonBlocking<{ name: string }>(() => () => {}))
