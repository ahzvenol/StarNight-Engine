import type { Macro, MacroCommand } from '../macro'
import type { SetImageCommandArgs } from '../script/image'
import { CommandEntity } from '../macro'

export const setImage: Macro<SetImageCommandArgs> = (args) => {
    const array = Array<MacroCommand>()
    args.file = `./static/ImageAsset/${args.file}.png`
    args.ease = 'easeInQuad'
    if (args.name !== 'BG') args.duration = 175
    array.push(CommandEntity.from('image', args))
    array.push(CommandEntity.from('unlock', { name: args.file }))
    return array
}
