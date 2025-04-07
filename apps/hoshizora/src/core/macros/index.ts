import { Macro } from 'starnight'
import { audio, closeaudio } from './script/hoshizora/audio'
import { bg, sprite } from './script/hoshizora/image'
import { say } from './script/hoshizora/say'
import { tweenimage } from './script/hoshizora/tween'
import { video } from './script/hoshizora/video'
import { wait } from './script/hoshizora/wait'

// 宏存在顺序依赖
// 逐个应用宏,单个宏被应用过后就不会再次应用
export const macros = [
    Macro.from('wait', wait),
    Macro.from('bg', bg),
    Macro.from('sprite', sprite),
    Macro.from('tween', tweenimage),
    Macro.from('closeaudio', closeaudio),
    Macro.from('video', video),
    Macro.from('say', say),
    Macro.from('audio', audio)
] as const
