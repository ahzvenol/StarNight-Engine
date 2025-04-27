import type { MacroFunction } from '@starnight/core'
import type { VideoCommandArgs } from '@/core/commands/script/video'

export const video: MacroFunction<VideoCommandArgs> = (args) => {
    args.file = `./static/${args.file}.mp4`
    return [{ key: 'video', args }]
}
