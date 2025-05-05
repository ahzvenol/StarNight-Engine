import { Macro } from '@starnight/core'
import { Backlog, Textbox } from '..'
import { set } from './audio'

export type SayCommandArgs = { text: string; name?: string; clip?: string }

export const say = Macro<SayCommandArgs>(
    (context) =>
        async function* ({ text, name, clip }) {
            if (clip !== undefined) yield set({ type: 'Clip', src: clip })
            yield Textbox.textpreview(text)
            if (name !== undefined) {
                yield Textbox.namepreview(name)
                yield Textbox.name(name)
            }
            yield Backlog.add(
                clip !== undefined ? { text, name, clip: `./static/AudioClip/${clip}.flac` } : { text, name }
            )
            await Textbox.text(text)(context)
            yield Textbox.icon()
        }
)
