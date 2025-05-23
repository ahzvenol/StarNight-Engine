import { Macro } from '@starnight/core'
import { Audio } from '.'
import { Backlog, Say } from '../base'

export type SayCommandArgs = { text: string; name?: string; clip?: string }

export const apply = Macro<SayCommandArgs>(
    (context) =>
        async function* ({ text, name, clip }) {
            if (clip !== undefined) yield Audio.clip({ src: clip })
            if (name !== undefined) yield Say.name(name)
            yield Backlog.add({ text, name, clip })
            await Say.text(text)(context)
            yield Say.end()
        }
)
