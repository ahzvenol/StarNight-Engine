import { Macro } from '../types/Marco'
import { audio } from './hoshizora/audio'
import { setImage } from './hoshizora/image'
import { say } from './hoshizora/say'
import { video } from './hoshizora/video'

export const macros = [
    Macro.from('image', setImage),
    Macro.from('audio', audio),
    Macro.from('video', video),
    Macro.from('say', say)
] as const
