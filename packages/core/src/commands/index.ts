import { wait } from './scripts/wait'
import { cont, end, jump, label } from './system/branch'
import { input } from './system/input'

export const SystemCommands = { continue: cont, jump, end, wait, label, input } as const
