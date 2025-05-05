import { Macro } from '@starnight/core'
import { Backlog, TextBox } from '../commands'
import { set } from './audio'

export type SayCommandArgs = { text: string; name?: string; clip?: string }

export const say = Macro<SayCommandArgs>(
    (context) =>
        async function* ({ text, name, clip }) {
            if (clip !== undefined) yield set({ type: 'Clip', src: clip })
            yield TextBox.textpreview(text)
            if (name !== undefined) {
                yield TextBox.namepreview(name)
                yield TextBox.name(name)
            }
            yield Backlog.add(
                clip !== undefined ? { text, name, clip: `./static/AudioClip/${clip}.flac` } : { text, name }
            )
            await TextBox.text(text)(context)
            yield TextBox.icon()
        }
)
