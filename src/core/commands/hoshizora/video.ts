import type { MacroFunction } from '@/core/types/Marco'
import type { VideoCommandArgs } from '../script/video'

export const video: MacroFunction<VideoCommandArgs> = (args) => {
    args.file = `./static/${args.file}.mp4`
    return [{ key: 'video', args }]
}
