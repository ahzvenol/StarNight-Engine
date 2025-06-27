import { DynamicMacro } from '@starnight/core'
import { Backlog, Say } from '../base'
import { Audio } from './index'

export type SayCommandArgs = { text: string | HTMLElement | HTMLElement[], name?: string, clip?: string }

export const apply = DynamicMacro<SayCommandArgs>(
    (context) =>
        function* ({ text, name, clip }) {
            const element = document.createElement('div')
            element.append(...(Array.isArray(text) ? text : [text]))
            if (clip !== undefined) yield Audio.clip({ src: clip })
            if (name !== undefined) yield Say.name(name)
            yield Backlog.add({ text: element.innerHTML, name, clip })
            yield Say.text(text)(context)
        }
)
