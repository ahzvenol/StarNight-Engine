import { wait } from './script/wait'
import { cont, end, jump, label } from './system/branch'
import { chain, fork, par } from './system/schedule'

export const StarNightSystemCommands = { continue: cont, jump, end, label, fork, par, chain, wait } as const
