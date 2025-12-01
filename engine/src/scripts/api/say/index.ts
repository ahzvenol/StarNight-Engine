import { DynamicMacro } from '@starnight/core'
import * as Audio from '../audio'
import * as Base from './base'

export type SayCommandArgs = { text: string, name?: string, clip?: string }

export const apply = DynamicMacro<SayCommandArgs>(
    () =>
        function* ({ text, name, clip }) {
            if (clip !== undefined) clip = `./static${clip}`
            if (clip !== undefined) yield Audio.clip({ src: clip })
            if (name !== undefined) yield Base.name(name)
            yield Base.log({ text, name, clip })
            yield yield Base.text(text)
        }
)
