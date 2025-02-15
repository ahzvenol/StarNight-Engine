import type { VideoCommandArgs } from '@/core/commands/script/video'
import type { MacroFunction } from '@/core/types/Marco'

export const video: MacroFunction<VideoCommandArgs> = (args) => {
    args.file = `./static/${args.file}.mp4`
    return [{ key: 'video', args }]
}
