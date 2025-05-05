import { wait } from './scripts/wait'
import { cont, end, jump, label } from './system/branch'

export const SystemCommands = { continue: cont, jump, end, wait, label } as const
