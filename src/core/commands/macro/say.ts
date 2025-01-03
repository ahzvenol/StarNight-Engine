import type { CommandEntitys } from '@/core/types/Command'
import type { MacroFunction } from '@/core/types/Marco'

export type SayCommandArgs = { text: string; name?: string; file?: string }

export const say: MacroFunction<SayCommandArgs> = ({ text, name, file }) => {
    const array = Array<CommandEntitys>()
    array.push({ sign: 'text', args: { text } })
    array.push({ sign: 'preview', args: { text } })
    if (name !== undefined) array.push({ sign: 'name', args: { name } })
    if (file !== undefined) array.push({ sign: 'audio', args: { type: 'Clip', file } })
    array.push({ sign: 'backlog', args: { text, name, file } })
    array.push({ sign: 'fork', args: [{ sign: 'text', args: { text } }] })
    return array
}
