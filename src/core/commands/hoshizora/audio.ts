import { CommandRunFunction, State } from '@/core/Command'
import { AudioCommandArgs, Audio as BaseAudio } from './../script/audio'
import { warp } from '@/core/macro'

// const audio: CommandRunFunction<AudioCommandArgs> = (context) => (args) => {
//     args.file = args.file ? `./static/AudioClip/${args.file}.wav` : ''
//     if (context.state === State.Init) {
//         BaseAudio.init(context)(args)
//     } else {
//         return BaseAudio.run(context)(args)
//     }
// }

export const Audio = warp(BaseAudio)((args) => {
    args.file = args.file ? `./static/AudioClip/${args.file}.wav` : ''
    return args
})
