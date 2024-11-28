import type { MacroAble, MacroFunction } from '@/core/types/Marco'
import { CommandEntity } from '@/core/types/Command'

export type SayCommandArgs = { text: string; name?: string; file?: string }

export const say: MacroFunction<SayCommandArgs> = ({ text, name, file }) => {
    const array = Array<MacroAble>()
    array.push(CommandEntity.from('text', { text }))
    if (name !== undefined) array.push(CommandEntity.from('name', { name }))
    if (file !== undefined) array.push(CommandEntity.from('audio', { type: 'Clip', file }))
    array.push(CommandEntity.from('backlog', { text, name, file }))
    return array
}
