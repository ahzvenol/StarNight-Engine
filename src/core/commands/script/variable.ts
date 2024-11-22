import type { CommandArg, Variables } from '../../type'
import { NonBlocking } from '@/core/flow'

export type VariableCommandArgs = { name: string; type: keyof Variables; value: CommandArg }

export const variable = NonBlocking<VariableCommandArgs>(({ variables }) => ({ name, type, value }) => {
    variables[type][name](value)
})
