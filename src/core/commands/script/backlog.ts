import { CommandRunFunction } from '@/core/Command'
import { useSignal } from '@/utils/Reactive'

type BacklogCommandArgs = { text: string; name?: string; file?: string }

export const backlogView = useSignal<Array<BacklogCommandArgs>>([])

const backlog: CommandRunFunction<BacklogCommandArgs> =
    () =>
    ({ text, name, file }) => {
        backlogView().unshift({ text, name, file })
        if (backlogView().length > 50) backlogView().pop()
    }

export const Backlog = { beforeInit: () => backlogView([]), init: backlog, run: backlog }
