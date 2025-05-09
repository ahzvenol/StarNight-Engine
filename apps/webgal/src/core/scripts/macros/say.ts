import { Macro } from '@starnight/core'
import { Audio } from '.'
import { Backlog, Say } from '../commands'

export type SayCommandArgs = { text: string; name?: string; clip?: string }

export const apply = Macro<SayCommandArgs>(
    (context) =>
        async function* ({ text, name, clip }) {
            if (clip !== undefined) yield Audio.set({ type: 'Clip', src: clip })
            yield Say.textpreview(text)
            if (name !== undefined) {
                yield Say.namepreview(name)
                yield Say.name(name)
            }
            yield Backlog.add(
                clip !== undefined ? { text, name, clip: `./static/AudioClip/${clip}.flac` } : { text, name }
            )
            await Say.text(text)(context)
            yield Say.icon()
        }
)
