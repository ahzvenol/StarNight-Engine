import { DynamicMacro } from '@starnight/core'
import * as Audio from '../audio'
import * as Impl from './impl'

export type SayCommandArgs = { text: string, name?: string, clip?: string }

export const apply = DynamicMacro<SayCommandArgs>(
    () =>
        function* ({ text, name, clip }) {
            const element = document.createElement('div')
            element.append(...(Array.isArray(text) ? text : [text]))
            if (clip !== undefined) yield Audio.clip({ src: clip })
            if (name !== undefined) yield Impl.name(name)
            yield Impl.log({ text, name, clip })
            yield (yield Impl.text(text))
        }
)
