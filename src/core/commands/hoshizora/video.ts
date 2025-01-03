import type { CommandEntitys } from '@/core/types/Command'
import type { MacroFunction } from '@/core/types/Marco'
import type { VideoCommandArgs } from '../script/video'

export const video: MacroFunction<VideoCommandArgs> = (args) => {
    const array = Array<CommandEntitys>()
    args.file = `./static/${args.file}.mp4`
    array.push({ key: 'video', args })
    return array
}
