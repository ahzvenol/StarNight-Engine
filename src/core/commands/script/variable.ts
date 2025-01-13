import type { CommandArg } from '@/core/types/Command'
import type { Variables } from '@/core/types/Game'
import { NonBlocking } from '@/core/command'

export type VariableCommandArgs = { name: string; type: keyof Variables; value: CommandArg }

export const variable = NonBlocking<VariableCommandArgs>(({ variables }) => ({ name, type, value }) => {
    variables[type][name](value)
})
