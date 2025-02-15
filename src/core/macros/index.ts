import { Macro } from '../types/Marco'
import { closeAudio, setAudio } from './script/hoshizora/audio'
import { setBG, setSprite } from './script/hoshizora/image'
import { say } from './script/hoshizora/say'
import { tweenImage } from './script/hoshizora/tween'
import { video } from './script/hoshizora/video'
import { wait } from './script/hoshizora/wait'

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
