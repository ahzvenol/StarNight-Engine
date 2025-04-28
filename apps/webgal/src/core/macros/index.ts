import { Macro } from '@starnight/core'
import { audio, closeaudio } from './script/audio'
import { bg, sprite, tweenimage } from './script/gasp-pixi'
import { say } from './script/say'
import { video } from './script/video'
import { wait } from './script/wait'

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
