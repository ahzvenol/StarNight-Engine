import type { Macro, MacroCommand } from '../macro'
import { CommandEntity } from '../macro'

type SayCommandArgs = { text: string; name?: string; file?: string }

export const say: Macro<SayCommandArgs> = ({ text, name, file: rawfile }) => {
    const array = Array<MacroCommand>()
    const file = rawfile ? `./static/AudioClip/${rawfile}.wav` : undefined
    array.push(CommandEntity.from('text', { text }))
    if (name !== undefined) array.push(CommandEntity.from('name', { name }))
    if (file !== undefined) array.push(CommandEntity.from('audio', { name: 'Clip', file }))
    array.push(CommandEntity.from('backlog', { text, name, file }))
    return array
}
