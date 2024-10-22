import { CommandRunFunction } from '@/core/Command'
import { par } from '../../macro'
import { Backlog } from '../script/backlog'
import { Name, Text } from '../script/textbox'

const say: CommandRunFunction<{ text: string; name?: string; file?: string }> = (context) => (args) =>
    par([() => Text.run(context)(args), () => Name.run(context)(args), () => Backlog.run(context)(args)])()

export const Say = { run: say }
