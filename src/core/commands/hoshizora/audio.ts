import { warp } from '@/core/macro'
import { Audio as BaseAudio } from './../script/audio'

export const Audio = warp(BaseAudio)((args) => {
    if (args.file !== undefined) args.file = `./static/AudioClip/${args.file}.wav`
    if (args.type === 'BGM') args.loop = true
    return args
})
