import { CommandRunFunction } from '@/core/Command'

const variable: CommandRunFunction =
    ({ variables }) =>
    ({ name, value }) => {
        variables[name] = value
    }
