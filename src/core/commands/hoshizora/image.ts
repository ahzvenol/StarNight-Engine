import { warp } from '@/core/macro'
import { SetImage as BaseSetImage } from '../script/image'

export const SetImage = warp(BaseSetImage)((args) => {
    console.log(args)

    args.file = `./static/ImageAsset/${args.file}.png`
    args.ease = 'easeInQuad'
    if (args.name !== 'BG') args.duration = 175
    return args
})
