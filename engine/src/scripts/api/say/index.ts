import { DynamicMacro } from '@starnight/core'
import * as Audio from '../audio'
import * as Impl from './impl'

export type SayCommandArgs = { text: string, name?: string, clip?: string }

export const apply = DynamicMacro<SayCommandArgs>(
    () =>
        function* ({ text, name, clip }) {
            if (clip !== undefined) yield Audio.clip({ src: clip })
            if (name !== undefined) yield Impl.name(name)
            yield Impl.log({ text, name, clip })
            yield yield Impl.text(text)
        }
)
