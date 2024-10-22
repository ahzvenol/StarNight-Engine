import { CommandRunFunction } from '@/core/Command'
import { useSignal } from '@/utils/Reactive'

type BacklogRow = { text: string; name?: string; file?: string }

export const backlogView = useSignal<Array<BacklogRow>>([])

const backlog: CommandRunFunction<BacklogRow> =
    () =>
    ({ text, name, file }) => {
        backlogView().unshift({ text, name, file })
        if (backlogView().length > 50) backlogView().pop()
    }

export const Backlog = { beforeInit: () => backlogView([]), run: backlog }
