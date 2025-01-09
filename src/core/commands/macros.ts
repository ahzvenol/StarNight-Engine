import { Macro } from '../types/Marco'
import { closeAudio, setAudio } from './hoshizora/audio'
import { setBG, setSprite } from './hoshizora/image'
import { tweenImage } from './hoshizora/tween'
import { video } from './hoshizora/video'
import { say } from './macro/say'

export const macros = [
    Macro.from('setBG', setBG),
    Macro.from('setS', setSprite),
    Macro.from('tween', tweenImage),
    Macro.from('audio', setAudio),
    Macro.from('closeA', closeAudio),
    Macro.from('video', video),
    Macro.from('say', say)
] as const
