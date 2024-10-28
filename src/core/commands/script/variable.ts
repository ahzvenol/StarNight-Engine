import { CommandArgTypes, CommandRunFunction } from '@/core/Command'

const variable: CommandRunFunction<{ name: string; value: CommandArgTypes }> =
    ({ variables }) =>
    ({ name, value }) => {
        variables[name] = value
    }

export const Variable = variable
