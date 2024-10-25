import { warp } from '@/core/macro'
import { SetImage as BaseSetImage } from '../script/image'

export const SetImage = warp(BaseSetImage)((args) => {
    args.file = `./static/ImageAsset/${args.file}.png`
    return args
})
