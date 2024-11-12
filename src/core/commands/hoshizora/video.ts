import type { Macro, MacroCommand } from '../macro'
import type { VideoCommandArgs } from '../script/video'

export const video: Macro<VideoCommandArgs> = (args) => {
    const array = Array<MacroCommand>()
    args.file = `./static/${args.file}.mp4`
    array.push(['video', args])
    return array
}
