import { Macro } from '../types/Marco'
import { closeAudio, setAudio } from './hoshizora/audio'
import { setBG, setSprite } from './hoshizora/image'
import { say } from './hoshizora/say'
import { tweenImage } from './hoshizora/tween'
import { video } from './hoshizora/video'
import { wait } from './hoshizora/wait'

// 宏存在顺序依赖
// 逐个应用宏,单个宏被应用过后就不会再次应用
export const macros = [
    Macro.from('wait', wait),
    Macro.from('setBG', setBG),
    Macro.from('setS', setSprite),
    Macro.from('tween', tweenImage),
    Macro.from('closeA', closeAudio),
    Macro.from('video', video),
    Macro.from('say', say),
    Macro.from('audio', setAudio)
] as const
