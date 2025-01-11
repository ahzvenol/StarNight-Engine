import { Macro } from '../types/Marco'
import { closeAudio, setAudio } from './hoshizora/audio'
import { setBG, setSprite } from './hoshizora/image'
import { say } from './hoshizora/say'
import { tweenImage } from './hoshizora/tween'
import { video } from './hoshizora/video'

// 宏存在顺序依赖,目前只有say需要在audio上面
// 由于运行时解析和预加载解析的方式不同,需要注意:
// 运行时逐层应用宏,所以如果宏返回多层结构,子层级还会再次被应用宏
// 预加载逐个应用宏,单个宏被应用过后就不会再次应用
export const macros = [
    Macro.from('setBG', setBG),
    Macro.from('setS', setSprite),
    Macro.from('tween', tweenImage),
    Macro.from('closeA', closeAudio),
    Macro.from('video', video),
    Macro.from('say', say),
    Macro.from('audio', setAudio)
] as const
