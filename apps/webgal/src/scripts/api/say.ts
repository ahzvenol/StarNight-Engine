import { DynamicMacro } from '@starnight/core'
import { Backlog, Say } from '../base'
import { Audio } from './index'

export type SayCommandArgs = { text: string | HTMLElement | HTMLElement[], name?: string, clip?: string }

export const apply = DynamicMacro<SayCommandArgs>(
    (context) =>
        function* ({ text, name, clip }) {
            const container = document.createElement('div')
            if (text instanceof Array) container.append(...text)
            else container.append(text)
            if (clip !== undefined) yield Audio.clip({ src: clip })
            if (name !== undefined) yield Say.name(name)
            yield Backlog.add({ text: container.innerHTML, name, clip })
            yield Say.text(container)(context)
        }
)
