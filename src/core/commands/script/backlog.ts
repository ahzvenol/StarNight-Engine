import type { CommandRunFunction } from '@/core/type'
import { useSignal } from '@/utils/Reactive'

type BacklogCommandArgs = { text: string; name?: string; file?: string }

type BacklogRowData = { index: number } & BacklogCommandArgs

export const backlogView = useSignal<Array<BacklogRowData>>([])

const backlog: CommandRunFunction<BacklogCommandArgs> =
    ({ index }) =>
    ({ text, name, file }) => {
        backlogView().unshift({ index, text, name, file })
        if (backlogView().length > 50) backlogView().pop()
    }

export const Backlog = backlog

export const BacklogHooks = { beforeInit: () => backlogView([]) }
