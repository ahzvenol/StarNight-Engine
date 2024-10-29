import { warp } from '@/core/macro'
import { Video as BaseVideo } from '../script/video'

export const Video = warp(BaseVideo)((args) => {
    args.file = `./static/${args.file}.mp4`
    return args
})
