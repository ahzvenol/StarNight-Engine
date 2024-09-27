import { CommandLifeCycleFunction, CommandRunFunction } from '@/core/Command'

const beforeInit: CommandLifeCycleFunction = ({ variables }) => (variables['userData'] = {})

const variable: CommandRunFunction =
    ({ variables }) =>
    ({ name, value }) => {
        variables.userData[name] = value
    }
