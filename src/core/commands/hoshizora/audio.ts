import { warp } from '@/core/macro'
import { Audio as BaseAudio } from './../script/audio'

export const Audio = warp(BaseAudio)((args) => {
    args.file = `./static/AudioClip/${args.file}.wav`
    return args
})
