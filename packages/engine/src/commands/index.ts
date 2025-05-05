import { wait } from './script/wait'
import { cont, end, jump, label } from './system/branch'

export const StarNightSystemCommands = { continue: cont, jump, end, wait, label } as const
