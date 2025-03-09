import type { CommandArgs, StandardCommand0 } from '@/core/types/Command'
import { NonBlocking, VirtualScope } from '@/core/decorator'

export const Continue = NonBlocking(() => () => ({ continue: true })) as StandardCommand0<CommandArgs>

export const Jump = NonBlocking(() => async ({ target }) => ({ jump: target, continue: true })) as StandardCommand0<{
    target: number | string
}>

export const End = NonBlocking(() => () => ({ end: true })) as StandardCommand0<CommandArgs>

export const label = VirtualScope(NonBlocking<{ name: string }>(() => () => {}))
