import { wait } from './commands/script/wait'
import { Continue, End, Jump, label } from './commands/system/branch'
import { Chain, Fork, Par } from './commands/system/schedule'
import { Commands } from './types/Command'

export const SystemCommands = {
    continue: Continue,
    jump: Jump,
    end: End,
    label,
    fork: Fork,
    par: Par,
    chain: Chain,
    wait
} satisfies Commands
