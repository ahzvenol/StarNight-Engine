import type { Macro, MacroCommand } from '../macro'

type SayCommandArgs = { text: string; name?: string; file?: string }

export const say: Macro<SayCommandArgs> = ({ text, name, file: rawfile }) => {
    const array = Array<MacroCommand>()
    const file = rawfile ? `./static/AudioClip/${rawfile}.wav` : undefined
    array.push(['text', { text }])
    if (name !== undefined) array.push(['name', { name }])
    if (file !== undefined) array.push(['audio', { name: 'Clip', file }])
    array.push(['backlog', { text, name, file }])
    return array
}
