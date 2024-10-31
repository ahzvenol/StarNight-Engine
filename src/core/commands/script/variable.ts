import { CommandArg, CommandRunFunction, Variables } from '@/core/type'

type VariableCommandArgs = { name: string; type: keyof Variables; value: CommandArg }

const variable: CommandRunFunction<VariableCommandArgs> =
    ({ variables }) =>
    ({ name, type, value }) => {
        variables[type][name](value)
    }

export const Variable = variable
