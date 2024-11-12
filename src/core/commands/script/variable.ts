import type { CommandArg, NonBlockingCommand, Variables } from '../../type'

export type VariableCommandArgs = { name: string; type: keyof Variables; value: CommandArg }

export const variable: NonBlockingCommand<VariableCommandArgs> =
    ({ variables }) =>
    ({ name, type, value }) => {
        variables[type][name](value)
    }
