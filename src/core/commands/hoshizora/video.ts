import type { Macro, MacroCommand } from '../macro'
import type { VideoCommandArgs } from '../script/video'
import { CommandEntity } from '../macro'

export const video: Macro<VideoCommandArgs> = (args) => {
    const array = Array<MacroCommand>()
    args.file = `./static/${args.file}.mp4`
    array.push(CommandEntity.from('video', args))
    return array
}
