import type { MacroAble, MacroFunction } from '@/core/types/Marco'
import type { SetImageCommandArgs } from '../script/image'
import { CommandEntity } from '@/core/types/Command'

export const setImage: MacroFunction<SetImageCommandArgs> = (args) => {
    const array = Array<MacroAble>()
    args.file = `./static/ImageAsset/${args.file}.png`
    args.ease = 'easeInQuad'
    if (args.name !== 'BG') args.duration = 175
    array.push(CommandEntity.from('image', args))
    array.push(CommandEntity.from('unlock', { file: args.file }))
    return array
}
