import { Macro } from '../types/Marco'
import { audio } from './hoshizora/audio'
import { setImage } from './hoshizora/image'
import { tweenImage } from './hoshizora/tween'
import { video } from './hoshizora/video'
import { say } from './macro/say'

export const macros = [
    Macro.from('image', setImage),
    Macro.from('tween', tweenImage),
    Macro.from('audio', audio),
    Macro.from('video', video),
    Macro.from('say', say)
] as const
