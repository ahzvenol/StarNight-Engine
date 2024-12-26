import type { CommandEntitys } from '@/core/types/Command'
import type { MacroFunction } from '@/core/types/Marco'
import type { SetImageCommandArgs } from '../script/image'

export const setImage: MacroFunction<SetImageCommandArgs> = (args) => {
    const array = Array<CommandEntitys>()
    args.file = `./static/ImageAsset/${args.file}.png`
    args.ease = 'easeInQuad'
    if (args.name !== 'BG') args.duration = 175
    array.push({ sign: 'image', args })
    array.push({ sign: 'unlock', args: { file: args.file } })
    return array
}
