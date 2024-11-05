import type { CommandRunFunction } from '@/core/type'
import type { SetImageCommandArgs } from '../script/image'
import { SetImage as BaseSetImage } from '../script/image'
import { Unlock } from '../script/unlock'

export const SetImage: CommandRunFunction<SetImageCommandArgs> = (context) => (args) => {
    Unlock(context)({ name: args.file })
    args.file = `./static/ImageAsset/${args.file}.png`
    args.ease = 'easeInQuad'
    if (args.name !== 'BG') args.duration = 175
    return BaseSetImage(context)(args)
}
