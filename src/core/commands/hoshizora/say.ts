import { CommandRunFunction } from '@/core/Command'
import { Async, par } from '../macro/~'
import { Name, Text } from '../script/textbox'
import { Backlog } from '../script/backlog'
import { log } from '@/utils/Logger'

const say: CommandRunFunction<{ text: string; name?: string; file?: string }> = (context) => (args) =>
    par(
        [() => Text.run(context)(args), () => Name.run(context)(args), () => Backlog.run(context)(args)].map(
            (cmd) =>
                new Async(() =>
                    Promise.resolve()
                        .then(cmd)
                        .catch((error) => log.error('命令运行出错:', error))
                        .then((result) => result ?? {})
                )
        )
    ).apply()

export const Say = { run: say }
