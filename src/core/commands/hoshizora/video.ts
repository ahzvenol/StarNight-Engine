import type { MacroAble, MacroFunction } from '@/core/types/Marco'
import type { VideoCommandArgs } from '../script/video'
import { CommandEntity } from '@/core/types/Command'

export const video: MacroFunction<VideoCommandArgs> = (args) => {
    const array = Array<MacroAble>()
    args.file = `./static/${args.file}.mp4`
    array.push(CommandEntity.from('video', args))
    return array
}
